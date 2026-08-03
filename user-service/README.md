# Eventora User Service

The User Service handles all authentication and identity management for the platform.

## Key Features
- Wraps AWS Cognito for user sign-up, sign-in, and password management.
- Admin APIs to fetch and manage users across the system.
- Provides JWT token validation utilities for other services.

## Tech Stack
- Node.js & Express.js
- AWS Cognito SDK

## Setup
1. Ensure `.env` is configured with `PORT=3000`, `COGNITO_USER_POOL_ID`, and AWS credentials.
2. Run `npm install`
3. Run `npm run dev`
