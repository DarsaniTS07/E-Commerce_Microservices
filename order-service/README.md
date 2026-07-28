# Eventora Order Service

The Order Service handles checkout processing and maintains user order histories.

## Key Features
- Converts carts into finalized orders.
- Confirms ticket reservations with the `inventory-service`.
- Interfaces with the `payment-service` to process transactions.
- Sends data to `notification-service` upon successful order.

## Tech Stack
- Node.js & Express.js
- AWS DynamoDB

## Setup
1. Ensure `.env` is configured with `PORT=3003`, `DYNAMODB_TABLE_ORDERS`, and internal service URLs.
2. Run `npm install`
3. Run `npm run dev`
