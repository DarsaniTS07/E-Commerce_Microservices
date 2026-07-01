# Payment Service

Payment microservice integrated with order and inventory APIs.

## Run locally

1. Install dependencies: `npm install`
2. Configure `.env`
3. Start: `npm run dev`

## Lambda entry

- handler: `handler.handler`

## Required DynamoDB indexes

- `orderId-index`
- `providerReference-index`
- `paymentStatus-createdAt-index`
