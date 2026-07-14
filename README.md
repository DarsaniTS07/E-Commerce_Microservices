# 🎟️ Ticket Booking Platform

> A production-style **serverless microservices-based Event Ticket
> Booking Platform** built using AWS Lambda, API Gateway, DynamoDB,
> Amazon Cognito, Amazon SNS, CloudWatch, and AWS X-Ray.

## 🚀 Features

-   Amazon Cognito Authentication (JWT)
-   Role-Based Access Control (User, Organizer, Admin)
-   Event, Inventory, Cart, Order, Payment, Waitlist and Notification
    Services
-   Event-driven communication using Amazon SNS
-   Internal API security using `x-internal-api-key`
-   AWS X-Ray tracing and CloudWatch monitoring

## 🏗️ Architecture

``` mermaid
flowchart TB
Client[React Frontend] --> Gateway[Amazon API Gateway]
Client --> Cognito[Amazon Cognito]
Gateway --> Event
Gateway --> Inventory
Gateway --> Cart
Gateway --> Order
Gateway --> Payment
Gateway --> Waitlist
Gateway --> Notification
Payment --> SNS[Amazon SNS]
SNS --> Notification
```

## 🔄 Booking Flow

User->>Cart: Add to Cart
Cart->>Order: Create Order
Order->>Inventory: Reserve Tickets
Order->>Payment: Initiate Payment
Payment->>Inventory: Confirm Tickets
Payment->>Order: Confirm Order
Payment->>Notification: Send Notification
```

## 📂 Project Structure

``` text
ticket-booking-platform/
├── event-service/
├── inventory-service/
├── cart-service/
├── order-service/
├── payment-service/
├── waitlist-service/
├── notification-service/
├── frontend/
├── postman/
└── README.md
```

## ☁️ AWS Services

-   API Gateway
-   Lambda
-   DynamoDB
-   Cognito
-   SNS
-   CloudWatch
-   X-Ray

## 🧪 Testing Flow

1.  Create Event
2.  Verify Inventory
3.  Add to Cart
4.  Create Order
5.  Initiate Payment
6.  Payment Callback
7.  Verify Order
8.  Verify Inventory
9.  Verify Notification

## 👩‍💻 Author

**Darsani T S**