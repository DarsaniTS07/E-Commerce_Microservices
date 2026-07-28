# Eventora Notification Service

The Notification Service manages all outbound communications to users, such as email or SMS.

## Key Features
- Sends order confirmation emails.
- Sends waitlist ticket availability alerts.
- Listens to internal triggers to dispatch messages.

## Tech Stack
- Node.js & Express.js
- AWS DynamoDB
- Third-party mailing API (Mocked/Integrated)

## Setup
1. Ensure `.env` is configured with `PORT=3005` and `DYNAMODB_TABLE_NOTIFICATIONS`.
2. Run `npm install`
3. Run `npm run dev`
