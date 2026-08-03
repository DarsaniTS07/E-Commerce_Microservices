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

---

# 🛡️ DevSecOps & CI/CD Pipeline Documentation

The E-Commerce Microservices repository has been integrated with a production-grade **DevSecOps CI/CD pipeline** built using **GitHub Actions**. It focuses on speed, cost efficiency, robust security scanning, and reliable deployment with automatic rollbacks.

## 📋 Pipeline Architecture

The pipeline consists of modular workflows utilizing reusable components and parallel matrix strategies:

```mermaid
graph TD
  A[Developer Commit] --> B[PR Created]
  B --> C[CI Workflow]
  C --> D[GitLeaks Secret Scan]
  C --> E[Snyk Dependency & Code Scan]
  C --> F[ESLint & Jest Unit Tests]
  F --> G{Coverage >= 80%?}
  G -- Yes --> H[Package Lambda ZIP]
  G -- No --> I[Fail Build]
  H --> J[Upload Build Artifact]
  
  K[Push to main / Dispatch] --> L[CD Workflow]
  L --> M[Security Gate]
  M --> N[Build & Package]
  N --> O[Deploy to AWS Lambda via OIDC]
  O --> P[Smoke Test Endpoint]
  P -- Success --> Q[Deployment Complete]
  P -- Failure --> R[Trigger Rollback to Previous Version]
```

## 🛠️ Workflow Files Structure

All GitHub Actions configurations are stored inside `.github/workflows/`:
1. [**`ci.yml`**](file:///.github/workflows/ci.yml): Main CI pipeline triggered on pull requests. Runs linting, testing, and security scanning on changed services.
2. [**`cd.yml`**](file:///.github/workflows/cd.yml): CD pipeline triggered on pushes to the `main` branch or manual dispatch. Deploys changed services to production.
3. [**`reusable-security.yml`**](file:///.github/workflows/reusable-security.yml): Runs Snyk (SCA + Code scan) and `npm audit` for changed services.
4. [**`reusable-test.yml`**](file:///.github/workflows/reusable-test.yml): Runs ESLint and Jest unit tests, checking that coverage is at least 80%.
5. [**`reusable-build.yml`**](file:///.github/workflows/reusable-build.yml): Validates service package structure and packages them into ZIP files.
6. [**`reusable-deploy.yml`**](file:///.github/workflows/reusable-deploy.yml): Deploys the service package to AWS Lambda, validates via smoke tests, and triggers rollbacks if necessary.

---

## 🔍 Changed-Service Detection

To avoid unnecessary costs and build times, we detect which services changed since the last deploy/commit:
- Script: [`detect-changes.sh`](file:///scripts/detect-changes.sh)
- **Algorithm**: It uses `git diff` to extract files changed between the base commit and head commit. If a change occurs in a service subdirectory (e.g., `cart-service/`), that service is queued for build and deployment.
- **Workflow / Infrastructure Modifications**: If the shared `scripts/` or `.github/workflows/` directory changes, **all** services are automatically flagged for rebuild to guarantee consistency.

---

## 🔒 DevSecOps Security Tools

The pipeline integrates multiple automated security scanners.

### 1. GitLeaks (Secret Scanning)
- **Scope**: Scans the entire repository history for exposed credentials, API tokens, private keys, etc., before any build or test tasks run.
- **Fail Action**: If any secrets are found, the pipeline halts immediately.
- **Reports**: Reports are uploaded to GitHub Artifacts as a SARIF file.

### 2. Snyk (SCA & Code Quality)
- **Snyk SCA (`snyk test`)**: Checks open-source library dependencies for known security vulnerabilities.
- **Snyk Code (`snyk code test`)**: Reviews custom code for security bugs and code quality.
- **Fail Action**: Fails the build if any **High** or **Critical** vulnerabilities exist.
- **Reports**: Combined HTML security reports are generated and uploaded.

### 3. Dependency Auditing (`npm audit`)
- **Scope**: Runs `npm audit --audit-level=high` on changed services.
- **Reports**: Uploads an audit JSON report.

---

## 🚀 Rollback and Deployment Process

### Deployment (`deploy.sh`)
- Deploys the service ZIP to AWS Lambda.
- Publishes a new version of the function.
- Reads the previous version the `production` alias was pointing to and writes it to a file.
- Updates the `production` alias to point to the new version.

### Smoke Testing (`smoke-test.sh`)
- Pings API Gateway endpoints (e.g., `/{service}/api/v1/health`).
- Validates that the response status code is `< 500` (e.g., `200` or auth `401/403` status).
- If the endpoint times out or returns a `5xx` error, the smoke test fails and triggers a rollback.

### Rollback (`rollback.sh`)
- If the smoke test or deploy step fails, the CD pipeline automatically triggers the rollback script.
- Reverts the `production` alias to point back to the previous stable version recorded during the deployment.

---

## 🔑 GitHub Secrets Config

Ensure the following secrets are configured in your GitHub Repository Settings under **Settings > Secrets and variables > Actions**:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AWS_ROLE_ARN` | IAM Role ARN assumed via GitHub OIDC | `arn:aws:iam::123456789012:role/github-actions-cd-role` |
| `SNYK_TOKEN` | Token retrieved from your Snyk Account | `snyk-api-token-xxxx-xxxx-xxxx` |

And the following Variable is recommended:
- `AWS_REGION` (Default: `ap-southeast-1`)
- `API_GATEWAY_URL` (E.g. `https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com`)

---

## 🔑 AWS OIDC & IAM Role Setup

To avoid static credentials, configure a GitHub OIDC provider in IAM.

### 1. Identity Provider Config
- **Provider URL**: `https://token.actions.githubusercontent.com`
- **Audience**: `sts.amazonaws.com`

### 2. Least Privilege IAM Trust Policy
Configure your IAM Role to only allow your repository to assume it:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/E-Commerce_Microservices:*"
        }
      }
    }
  ]
}
```

### 3. Pipeline Minimum Permissions (IAM Policy)
Attach this inline policy to the OIDC IAM Role to allow Lambda deployments:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:GetFunction",
        "lambda:ListVersionsByFunction",
        "lambda:GetAlias",
        "lambda:CreateAlias",
        "lambda:UpdateAlias"
      ],
      "Resource": "arn:aws:lambda:ap-southeast-1:ACCOUNT_ID:function:darsani_*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:GET"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## ➕ Onboarding a New Microservice

To add a new service to the DevSecOps CI/CD pipeline:
1. Create a new folder at the root (e.g. `catalog-service`).
2. Implement your logic with a `handler.js` at the root.
3. Configure `package.json` with a `"test": "jest"` command and the Jest configuration.
4. Add the service name to the `SERVICES` array inside [`detect-changes.sh`](file:///scripts/detect-changes.sh#L19-L28).
5. Add the function configuration to `locals.lambda_config` in [`infra/lambdas.tf`](file:///infra/lambdas.tf).
6. Commit and push. The pipeline will automatically scan, test, package, and deploy the new service!
