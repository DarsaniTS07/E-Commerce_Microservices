# Inventory Service

## Responsibilities

- Maintain ticket availability
- Reserve tickets
- Release tickets
- Confirm ticket reservations
- Prevent overselling

## API Endpoints

GET /inventory

POST /inventory/reserve

POST /inventory/release

POST /inventory/confirm

## Future AWS Architecture

API Gateway
↓
Lambda
↓
Controller
↓
Service
↓
Repository
↓
DynamoDB