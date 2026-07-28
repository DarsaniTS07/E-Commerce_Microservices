# Eventora Frontend Application

The frontend client for the Eventora E-Commerce platform. It is a single-page application that provides user interfaces for discovering events, managing carts, checking out, and a dedicated admin dashboard for platform management.

## Key Features
- Responsive and modern UI with Tailwind CSS.
- Secure authentication via AWS Cognito (Login, Signup, Password resets).
- Real-time cart and checkout flow.
- Admin dashboard with data visualization (Recharts).

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- React Router v6
- React Query (for data fetching and caching)
- React Hook Form & Zod (for form validation)
- Axios

## Setup
1. Ensure `.env` is configured with `VITE_API_URL` and `VITE_COGNITO_CLIENT_ID`.
2. Run `npm install`
3. Run `npm run dev`

The application will start on `http://localhost:5173`.
