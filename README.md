# Ticket Booking Platform Backend

Production-style modular backend for an event ticket booking platform built with Node.js, Express.js, MongoDB, and Mongoose.

The codebase is organized as a modular monolith so each domain can later be split into independent services or migrated to AWS-managed services without changing the business logic layer.

## Goals

- Prevent overselling of tickets
- Support cart-based reservations with expiry
- Support order creation, cancellation, and refunds
- Support idempotent payment callbacks
- Support FIFO waitlists for sold-out events
- Keep controllers thin and business logic isolated in services
- Keep repositories replaceable so MongoDB can later be swapped with DynamoDB
- Prepare the API for authentication and role-based authorization

## Technology Stack

- Node.js
- Express.js
- MongoDB
- dotenv
- uuid
- express-validator
- nodemon

## Project Structure

```text
src/
  app.js
  server.js
  config/
  middlewares/
  utils/
  services/
    product/
    inventory/
    cart/
    order/
    payment/
    waitlist/
    notification/
```

## Architecture

Each service follows this flow:

Controller -> Service -> Repository -> MongoDB

Controllers never access MongoDB directly. Business rules live in services. Repositories are the only layer that touches Mongoose models.

## Booking Lifecycle

```text
Event Created
  -> Tickets Published
  -> Users Browse Events
  -> Users Add Tickets To Cart
  -> Inventory Reserved
  -> Order Created
  -> Payment Completed
  -> Booking Confirmed

Payment Failed
  -> Inventory Released
  -> Booking Cancelled
  -> Inventory Released
  -> Waitlist Triggered
  -> Notify Next User
```

## Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## Authentication And Roles

The backend is auth-ready and now supports a request user context through headers while you wire a real identity provider later.

### Current Request Context

- `x-user-id` - Injects the authenticated user id into `req.user.id`
- `x-user-role` - Injects the authenticated role into `req.user.role`

### Roles

- `user` - Browse events, manage cart, place orders, join waitlists, view notifications
- `organizer` - Create, update, and remove events they own
- `admin` - Full operational control, including inventory mutations and refund views

### Route Protection Model

- Public browsing endpoints remain open
- Event creation and maintenance require `organizer` or `admin`
- Inventory mutation endpoints require `admin`
- Refund reporting requires `admin`
- User-scoped routes now prefer authenticated identity, with the legacy `userId` input kept as fallback during migration

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Use the existing `backend/.env` file, or create `.env` in the backend folder with your local values.

3. Start the API:

```bash
npm run dev
```

4. Health check:

```bash
GET /health
```

5. Open API docs in the browser:

```bash
http://localhost:3000/api-docs
```

## Configuration

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/ticket_booking_platform (Reference)
NODE_ENV=development
```

## API Reference

Base URL: `http://localhost:3000`

All endpoints below are listed in utilstyle format with purpose, parameters, and expected behavior.

---

## Health

### GET /health
Returns the service status.

- Purpose: Verify the API is running
- Auth: None
- Response: `{ status: "ok" }`

---

## Event Service

Purpose: Manage events.

### Event Schema

- `eventId` - Unique event identifier
- `title` - Event title
- `description` - Event description
- `category` - Event category such as Concert, Sports, Standup, Conference
- `venue` - Venue name
- `city` - City where the event is hosted
- `eventDate` - Event date
- `eventTime` - Event time
- `status` - `DRAFT`, `PUBLISHED`, or `CANCELLED`
- `availableStatus` - `AVAILABLE`, `LIMITED`, `SOLD_OUT`, `HIDDEN`
- `availableTicketCount` - Live ticket count shown to users
- `ticketPrice` - Ticket price
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### GET /events
Returns a paginated list of published events.

- Query parameters:
  - `page` - Page number
  - `limit` - Page size
  - `city` - Filter by city
  - `category` - Filter by category
  - `date` - Filter by date
- Notes: Supports sorting through query parameters handled by the pagination helper.

### GET /events/search
Searches events using the same filter model as the list endpoint.

- Query parameters:
  - `city`
  - `category`
  - `date`
- Notes: Intended for event discovery and catalog search flows.

### GET /events/:eventId
Returns full event details.

- Path parameters:
  - `eventId` - Event identifier
- Notes: Also includes the linked inventory snapshot when available.

### POST /events
Creates a new event.

- Body:
  - `title` - Required string
  - `description` - Required string
  - `category` - Required string
  - `venue` - Required string
  - `city` - Required string
  - `eventDate` - Required ISO date string
  - `eventTime` - Required string
  - `ticketPrice` - Required number
  - `availableTicketCount` - Optional number
- Notes: New events default to `PUBLISHED` unless overridden.

### PUT /events/:eventId
Updates an event.

- Path parameters:
  - `eventId` - Event identifier
- Body:
  - `title` - Optional string
  - `description` - Optional string
  - `ticketPrice` - Optional number
- Notes: Supports partial updates.

### DELETE /events/:eventId
Soft deletes an event.

- Path parameters:
  - `eventId` - Event identifier
- Notes: Marks the event deleted instead of removing it permanently.

---

## Inventory Service

Purpose: Maintain ticket availability and enforce oversell prevention.

### Inventory Schema

- `inventoryId` - Unique inventory identifier
- `eventId` - Linked event identifier
- `totalTickets` - Total stock for the event
- `availableTickets` - Tickets that can still be reserved
- `reservedTickets` - Tickets currently held in carts or pending checkout

### GET /inventory?eventId=:eventId
Returns current availability for an event.

- Query parameters:
  - `eventId` - Required event identifier
- Notes: Returns the live inventory state.

### POST /inventory/internal/inventory/reserve
Reserves tickets atomically.

- Body:
  - `eventId` - Required string
  - `quantity` - Required integer greater than 0
- Notes: Fails if insufficient availability exists.

### POST /inventory/internal/inventory/release
Releases previously reserved tickets.

- Body:
  - `eventId` - Required string
  - `quantity` - Required integer greater than 0
- Notes: Used for cart removal, payment failure, cancellation, and expiry recovery.

### POST /inventory/internal/inventory/confirm
Confirms reserved tickets after successful payment.

- Body:
  - `eventId` - Required string
  - `quantity` - Required integer greater than 0
- Notes: Moves tickets from reserved to confirmed capacity.

---

## Cart Service

Purpose: Temporary holding area before checkout.

### Cart Schema

- `cartId` - Unique cart item identifier
- `userId` - User identifier
- `eventId` - Event identifier
- `quantity` - Ticket quantity
- `reservationExpiry` - Reservation expiry timestamp
- `status` - `ACTIVE`, `EXPIRED`, `REMOVED`, `CHECKED_OUT`
- `orderId` - Linked order identifier after checkout

### POST /cart
Adds tickets to cart and reserves inventory.

- Body:
  - `userId` - Required string
  - `eventId` - Required string
  - `quantity` - Required integer greater than 0
- Notes:
  - If an active cart already exists for the same user and event, the quantity is updated by delta.
  - Reservation expiry is set to 15 minutes.

### GET /cart?userId=:userId
Returns the user cart entries.

- Query parameters:
  - `userId` - Required string
- Notes: Expired carts are auto-processed before listing.

### PUT /cart/items
Updates cart quantity and adjusts reservation.

- Body:
  - `userId` - Required string
  - `cartId` - Required string
  - `quantity` - Required integer greater than 0
- Notes: Increase reserves more inventory, decrease releases inventory.

### DELETE /cart/items
Removes a cart item and releases inventory.

- Body:
  - `userId` - Required string
  - `cartId` - Required string
- Notes: Also triggers waitlist processing for the event.

---

## Order Service

Purpose: Manage booking orders and ticket confirmation lifecycle.

### Order Schema

- `orderId` - Unique order identifier
- `cartId` - Linked cart item identifier
- `userId` - User identifier
- `eventId` - Event identifier
- `quantity` - Ticket quantity
- `amount` - Total order amount
- `status` - `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `REFUNDED`
- `ticketCode` - Generated ticket code after confirmation
- `cancellationReason` - Cancellation reason when applicable

### POST /orders
Creates an order from a valid cart reservation.

- Body:
  - `cartId` - Required string
- Notes:
  - Validates that the cart is active.
  - Marks the cart as checked out.
  - Computes order amount from event ticket price and quantity.

### GET /orders/:orderId
Returns order details.

- Path parameters:
  - `orderId` - Required string

### GET /orders/users/:userId/orders
Returns booking history for a user.

- Path parameters:
  - `userId` - Required string

### POST /orders/:orderId/cancel
Cancels a booking and releases inventory.

- Path parameters:
  - `orderId` - Required string
- Body:
  - `reason` - Optional string
- Notes: Also triggers waitlist processing.

### GET /orders/:orderId/ticket
Returns the generated ticket payload.

- Path parameters:
  - `orderId` - Required string
- Notes: Only available for confirmed orders.

---

## Payment Service

Purpose: Handle payment initiation, callbacks, refunds, and idempotency.

### Payment Schema

- `paymentId` - Unique payment identifier
- `orderId` - Linked order identifier
- `amount` - Payment amount
- `paymentStatus` - `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`
- `providerReference` - External payment reference
- `callbackProcessedAt` - Timestamp of callback processing
- `refundReference` - Refund reference when applicable

### POST /payments
Initiates a payment for an order.

- Body:
  - `orderId` - Required string
- Notes:
  - Creates one payment record per order.
  - Repeated initiation returns the existing payment record.

### POST /payments/callback
Simulates a payment gateway callback.

- Body:
  - `status` - Required enum: `SUCCESS` or `FAILED`
  - `orderId` - Optional string
  - `providerReference` - Optional string
- Notes:
  - Idempotent callback processing is supported.
  - On success: inventory is confirmed and order is confirmed.
  - On failure: inventory is released and order is cancelled.

### GET /payments/:orderId
Returns payment status for an order.

- Path parameters:
  - `orderId` - Required string

### GET /payments/refunds
Returns refund records.

- Notes: Useful for reconciliation and refund reporting.

---

## Waitlist Service

Purpose: Manage FIFO waitlists for sold-out events.

### Waitlist Schema

- `waitlistId` - Unique waitlist entry identifier
- `eventId` - Event identifier
- `userId` - User identifier
- `quantity` - Requested ticket quantity
- `position` - FIFO position
- `status` - `WAITING`, `NOTIFIED`, `EXPIRED`, `BOOKED`
- `joinedAt` - Entry timestamp
- `notifiedAt` - Notification timestamp
- `expiresAt` - Booking window expiry timestamp

### POST /waitlist
Joins a user to the waitlist.

- Body:
  - `eventId` - Required string
  - `userId` - Required string
  - `quantity` - Required integer greater than 0
- Notes: FIFO position is assigned based on current waiting entries.

### GET /waitlist?eventId=:eventId&userId=:userId
Returns the waitlist position for a user on an event.

- Query parameters:
  - `eventId` - Required string
  - `userId` - Required string

### GET /waitlist/users/:userId/waitlists
Returns all waitlist entries for a user.

- Path parameters:
  - `userId` - Required string

### DELETE /waitlist
Leaves the waitlist.

- Body:
  - `waitlistId` - Required string
- Notes: Marks the waitlist entry as expired/left.

---

## Notification Service

Purpose: Store system notifications for booking window and waitlist events.

### Notification Schema

- `notificationId` - Unique notification identifier
- `userId` - Target user identifier
- `message` - Notification body
- `status` - `UNREAD` or `READ`
- `readAt` - Timestamp when the notification was marked read

### GET /notifications
Returns notifications.

- Query parameters:
  - `userId` - Optional string
- Notes: If `userId` is provided, returns only that user's notifications.

### PUT /notifications/:notificationId/read
Marks a notification as read.

- Path parameters:
  - `notificationId` - Required string

---

## Operational Rules

- Ticket oversell prevention is enforced by inventory reservation checks.
- Cart reservations expire after 15 minutes.
- Payment callbacks are idempotent.
- Cancellations and payment failures release inventory.
- Waitlist processing follows FIFO ordering.
- Notifications are created when a user is moved from waitlist into a booking window.
- All delete-style event actions use soft deletion.

## Error Handling

Common validation failures return `400` with an `errors` array.

Common domain failures use a structured error response and status codes such as:

- `404` - Resource not found
- `409` - Conflict or business rule violation
- `500` - Unexpected server error

## Future AWS Migration Fit

The repository/service split is intentionally aligned so the MongoDB repositories can later be replaced with DynamoDB-backed repositories. The business logic should not need to change when that migration happens.

A future cloud implementation can map naturally to:

- API Gateway
- Lambda
- DynamoDB
- SNS
- SQS

## Notes

- This backend is intentionally documentation-heavy and service-oriented rather than CRUD-only.
- Internal inventory endpoints are included because they are part of the booking lifecycle, even though they would usually be protected in a real deployment.
