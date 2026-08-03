# Eventora Event Service

The Event Service is the core catalog of the Eventora platform. It handles the creation, updating, and retrieval of event details.

## Key Features
- Create and manage events (Admin only).
- Browse and search events with filters (location, date, category).
- View detailed event information.
- Communicates with `inventory-service` to initialize ticket capacity.

## Tech Stack
- Node.js & Express.js
- AWS DynamoDB
- AWS S3 (for event images)

## Setup
1. Ensure `.env` is configured with `PORT=3001`, `DYNAMODB_TABLE_EVENTS`, and `INVENTORY_SERVICE_BASE_URL`.
2. Run `npm install`
3. Run `npm run dev`