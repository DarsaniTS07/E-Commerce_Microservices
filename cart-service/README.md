# Eventora Cart Service

The Cart Service manages user shopping carts for the Eventora platform. It allows users to add tickets to their cart and temporarily reserves them in the inventory service to prevent double-booking before checkout.

## Key Features
- Add/Remove tickets from the cart.
- View cart contents.
- Temporary ticket reservation holds (communicates with `inventory-service`).
- Auto-clearing of stale carts (TTL logic).

## Tech Stack
- Node.js & Express.js
- AWS DynamoDB
- Internal communication via Axios

## Setup
1. Ensure `.env` is configured with `PORT=3002`, `DYNAMODB_TABLE_CART`, and `INVENTORY_SERVICE_BASE_URL`.
2. Run `npm install`
3. Run `npm run dev`
