# Order Service

Order orchestration microservice integrated with cart, event, inventory, and waitlist APIs.

## Run locally

1. Install dependencies: `npm install`
2. Configure `.env`
3. Start: `npm run dev`

## Lambda entry

- handler: `handler.handler`

## Required DynamoDB indexes

- `cartId-index`
- `userId-createdAt-index`
