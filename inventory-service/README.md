# Eventora Inventory Service

The Inventory Service acts as the single source of truth for ticket counts, availability, and reservations.

## Key Features
- Tracks total, available, and reserved tickets.
- Exposes internal APIs for atomic reservation and release of tickets.
- Connects with `waitlist-service` when events sell out.

## Tech Stack
- Node.js & Express.js
- AWS DynamoDB

## Setup
1. Ensure `.env` is configured with `PORT=3006`, `DYNAMODB_TABLE_INVENTORY`, and `INTERNAL_API_KEY`.
2. Run `npm install`
3. Run `npm run dev`