# Cart Service

Cart microservice for reservation lifecycle.

## Run locally

1. Install dependencies: `npm install`
2. Configure `.env`
3. Start: `npm run dev`

## Lambda entry

- handler: `handler.handler`

## Required DynamoDB indexes

- `userId-createdAt-index`
- `userId-eventId-index`
- `status-reservationExpiry-index`
