# Eventora Waitlist Service

The Waitlist Service allows users to queue up for sold-out events.

## Key Features
- Register users for waitlists.
- Tracks waitlist position and timestamps.
- Communicates with Inventory and Notification services to alert users if capacity opens up.

## Tech Stack
- Node.js & Express.js
- AWS DynamoDB

## Setup
1. Ensure `.env` is configured with `PORT=3007` and `DYNAMODB_TABLE_WAITLIST`.
2. Run `npm install`
3. Run `npm run dev`
