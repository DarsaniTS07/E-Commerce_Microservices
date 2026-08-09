# Eventora - E-Commerce Microservices Platform

Eventora is a modern, highly scalable event ticketing and management platform built on a microservices architecture. It allows users to discover, book, and manage event tickets while providing administrators with powerful tools to create events, manage inventory, and view platform analytics.

## Architecture Overview

![Eventora Architecture](./e-commerce_architecture.png)

The platform is designed using a microservices architecture, with independent services communicating securely via internal APIs. The frontend is built with React and Vite.

### Core Microservices

- **`event-service`**: Manages the creation, retrieval, and updating of events. Acts as the core catalog.
- **`cart-service`**: Handles user shopping carts and temporarily reserves tickets in the inventory service to prevent double-booking.
- **`order-service`**: Processes checkouts, creates final orders, and confirms ticket reservations.
- **`payment-service`**: Handles payment processing (mocked/integrated) and updates order statuses.
- **`notification-service`**: Responsible for sending emails, SMS, or push notifications to users.
- **`inventory-service`**: Manages ticket availability, reservations, and total capacity.
- **`waitlist-service`**: Manages users waiting for tickets to sold-out events.
- **`user-service`**: Handles user authentication, authorization, and profile management using AWS Cognito.

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, React Query, React Hook Form, Zod.
- **Backend**: Node.js, Express.js.
- **Database**: AWS DynamoDB (NoSQL) for all microservices.
- **Authentication**: AWS Cognito.
- **Infrastructure as Code (IaC)**: Terraform (manages API Gateway, AWS Lambda functions, IAM, and dashboards).

## Getting Started

### Prerequisites

- Node.js (v18+)
- Terraform (v1.0+)
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
  N --> O[Deploy to AWS Lambda via IAM Credentials]
  O --> P[Smoke Test Endpoint]
  P -- Success --> Q[Deployment Complete]
  P -- Failure --> R[Trigger Rollback to Previous Version]
```

## 🛠️ Workflow Files Structure

All GitHub Actions configurations are stored inside `.github/workflows/`:
1. [**`ci.yml`**](file:///.github/workflows/ci.yml): Main CI pipeline triggered on pull requests. Runs linting, testing, and security scanning on changed services.
2. [**`cd.yml`**](file:///.github/workflows/cd.yml): CD pipeline triggered on pushes to the `main` branch or manual dispatch. Deploys changed services to production.
3. [**`frontend-deploy.yml`**](file:///.github/workflows/frontend-deploy.yml): Deploys the React frontend to AWS S3 and invalidates the CloudFront cache when changes occur in `eventora-frontend/`.
4. [**`reusable-security.yml`**](file:///.github/workflows/reusable-security.yml): Runs Snyk (SCA + Code scan) and `npm audit` for changed services.
5. [**`reusable-test.yml`**](file:///.github/workflows/reusable-test.yml): Runs ESLint and Jest unit tests, checking that coverage is at least 80%.
6. [**`reusable-build.yml`**](file:///.github/workflows/reusable-build.yml): Validates service package structure and packages them into ZIP files.
7. [**`reusable-deploy.yml`**](file:///.github/workflows/reusable-deploy.yml): Deploys the service package to AWS Lambda, validates via smoke tests, and triggers rollbacks if necessary.

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

### 3. SonarQube / SonarCloud
- **Scope**: Analyzes codebase for bugs, code smells, vulnerabilities, and calculates test coverage.
- **Integration**: Configured via `sonar-project.properties` and integrated into the `ci.yml` pipeline.
- **Fail Action**: Quality gate failure will block the pipeline.

### 4. Dependency Auditing (`npm audit`)
- **Scope**: Runs `npm audit --audit-level=high` on changed services.
- **Reports**: Uploads an audit JSON report.

---

## 🚀 Rollback and Deployment Process

### Backend Deployment (`deploy.sh`)
- Deploys the service ZIP to AWS Lambda.
- Publishes a new version of the function.
- Reads the previous version the `production` alias was pointing to and writes it to a file.
- Updates the `production` alias to point to the new version.

### Backend Smoke Testing (`smoke-test.sh`)
- Pings API Gateway endpoints (e.g., `/{service}/api/v1/health`).
- Validates that the response status code is `< 500` (e.g., `200` or auth `401/403` status).
- If the endpoint times out or returns a `5xx` error, the smoke test fails and triggers a rollback.

### Backend Rollback (`rollback.sh`)
- If the smoke test or deploy step fails, the CD pipeline automatically triggers the rollback script.
- Reverts the `production` alias to point back to the previous stable version recorded during the deployment.

### Frontend Deployment
- Uses the `frontend-deploy.yml` workflow when changes occur in `eventora-frontend/`.
- Builds the React + Vite application.
- Syncs the generated `dist/` directory directly to an AWS S3 bucket.
- Triggers an AWS CloudFront cache invalidation (`/*`) to ensure edge locations serve the latest version.

---

## 🔑 GitHub Secrets Config

Ensure the following secrets are configured in your GitHub Repository Settings under **Settings > Secrets and variables > Actions**:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key ID for deployment | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Access Key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_SESSION_TOKEN` | (Optional) AWS Session Token if using temporary credentials | `...` |
| `SNYK_TOKEN` | Token retrieved from your Snyk Account | `snyk-api-token-xxxx-xxxx-xxxx` |
| `SONAR_TOKEN` | Token for SonarCloud/SonarQube analysis | `8402...` |

And the following Variable is recommended:
- `AWS_REGION` (Default: `ap-southeast-1`)
- `API_GATEWAY_URL` (E.g. `https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com`)

---

## ➕ Onboarding a New Microservice

To add a new service to the DevSecOps CI/CD pipeline:
1. Create a new folder at the root (e.g. `catalog-service`).
2. Implement your logic with a `handler.js` at the root.
3. Configure `package.json` with a `"test": "jest"` command and the Jest configuration.
4. Add the service name to the `SERVICES` array inside [`detect-changes.sh`](file:///scripts/detect-changes.sh#L19-L28).
5. Add the function configuration to `locals.lambda_config` in [`infra/lambdas.tf`](file:///infra/lambdas.tf).
6. Commit and push. The pipeline will automatically scan, test, package, and deploy the new service!
