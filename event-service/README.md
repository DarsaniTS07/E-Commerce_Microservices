# Event Service

## Responsibilities

- Create Event
- Update Event
- Delete Event
- Search Events
- Get Event Details

## Architecture

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

(Currently Express + MongoDB)

## Future AWS Migration

- API Gateway
- Lambda
- DynamoDB
- EventBridge (EventCreated)