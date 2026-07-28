# Eventora - E-Commerce Microservices Platform

Eventora is a modern, highly scalable event ticketing and management platform built on a microservices architecture. It allows users to discover, book, and manage event tickets while providing administrators with powerful tools to create events, manage inventory, and view platform analytics.

## Architecture Overview

The platform is designed using a microservices architecture, with independent services communicating securely via internal APIs. The frontend is built with React and Vite.

### Core Microservices


- **`event-service`** (Port 3001): Manages the creation, retrieval, and updating of events. Acts as the core catalog.
- **`cart-service`** (Port 3002): Handles user shopping carts and temporarily reserves tickets in the inventory service to prevent double-booking.
- **`order-service`** (Port 3003): Processes checkouts, creates final orders, and confirms ticket reservations.
- **`payment-service`** (Port 3004): Handles payment processing (mocked/integrated) and updates order statuses.
- **`notification-service`** (Port 3005): Responsible for sending emails, SMS, or push notifications to users.
- **`inventory-service`** (Port 3006): Manages ticket availability, reservations, and total capacity.
- **`waitlist-service`** (Port 3007): Manages users waiting for tickets to sold-out events.
- **`user-service`** (Port 3008): Handles user authentication, authorization, and profile management using AWS Cognito.

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, React Query, React Hook Form, Zod.
- **Backend**: Node.js, Express.js.
- **Database**: AWS DynamoDB (NoSQL) for all microservices.
- **Authentication**: AWS Cognito.

## Getting Started

### Prerequisites

- Node.js (v18+)
- AWS Account (DynamoDB and Cognito configured)
- `.env` files populated for each service with appropriate AWS credentials and internal API keys.

### Running the Project

To run the project locally, you must start each microservice independently on its designated port, followed by the frontend:

```bash
# Example starting the event-service
cd event-service
npm install
npm run dev
```

## Internal Communication

Services communicate with each other securely using internal API keys passed in the headers (`x-internal-api-key`). Public APIs are secured via AWS Cognito JWT tokens.
