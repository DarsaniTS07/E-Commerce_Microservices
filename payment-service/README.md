# Eventora Payment Service

The Payment Service acts as an integration layer for processing financial transactions.

## Key Features
- Generates mock payment intents.
- Processes webhooks from payment gateways (e.g., Stripe/Razorpay).
- Notifies the Order Service of payment success/failure.

## Tech Stack
- Node.js & Express.js
- AWS DynamoDB

## Setup
1. Ensure `.env` is configured with `PORT=3004` and `DYNAMODB_TABLE_PAYMENTS`.
2. Run `npm install`
3. Run `npm run dev`
