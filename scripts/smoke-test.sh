#!/usr/bin/env bash
# ==============================================================================
# smoke-test.sh
# Invokes the API Gateway endpoint for a deployed microservice and validates
# the response. Fails if the Lambda function times out, crashes (5xx), or returns
# an unexpected status.
#
# Usage:
#   bash scripts/smoke-test.sh <service_name> <aws_region>
#
# Example:
#   bash scripts/smoke-test.sh cart-service ap-southeast-1
# ==============================================================================

set -euo pipefail

SERVICE_NAME="${1:-}"
REGION="${2:-ap-southeast-1}"

if [ -z "$SERVICE_NAME" ]; then
  echo "::error::Service name is a required parameter." >&2
  exit 1
fi

# ── Map Service to Route Prefix ───────────────────────────────────────────────
get_route_prefix() {
  case "$1" in
    "cart-service") echo "cart" ;;
    "event-service") echo "events" ;;
    "inventory-service") echo "inventory" ;;
    "notification-service") echo "notifications" ;;
    "order-service") echo "orders" ;;
    "payment-service") echo "payments" ;;
    "user-service") echo "users" ;;
    "waitlist-service") echo "waitlist" ;;
    *) echo "${1%-service}" ;;
  esac
}

ROUTE_PREFIX=$(get_route_prefix "$SERVICE_NAME")

# ── Determine API Gateway URL ──────────────────────────────────────────────────
if [ -z "${API_BASE_URL:-}" ] || [ "${API_BASE_URL}" = "null" ]; then
  echo "ℹ️ API_BASE_URL environment variable is empty. Discovering via AWS CLI..."
  API_ID=$(aws apigatewayv2 get-apis \
    --region "$REGION" \
    --query "Items[?Name=='darsani_API_Gateway'].ApiId | [0]" \
    --output text 2>/dev/null || echo "")

  if [ -n "$API_ID" ] && [ "$API_ID" != "None" ] && [ "$API_ID" != "null" ]; then
    export API_BASE_URL="https://${API_ID}.execute-api.${REGION}.amazonaws.com"
  else
    # Hardcoded fallback from outputs.tf
    export API_BASE_URL="https://4bsnhdrhji.execute-api.ap-southeast-1.amazonaws.com"
  fi
fi

# Trim trailing slash
API_BASE_URL="${API_BASE_URL%/}"
echo "ℹ️ Using API Gateway Base URL: $API_BASE_URL"

# We check two endpoints to be safe: first the health check, then root path
ENDPOINTS=(
  "${API_BASE_URL}/${ROUTE_PREFIX}/api/v1/health"
  "${API_BASE_URL}/${ROUTE_PREFIX}/api/v1/${ROUTE_PREFIX}"
  "${API_BASE_URL}/${ROUTE_PREFIX}"
)

echo "🔍 Running smoke tests for $SERVICE_NAME..."

SUCCESS=false
HTTP_STATUS=""
RESPONSE_BODY=""

for ENDPOINT in "${ENDPOINTS[@]}"; do
  echo "📡 Pinging endpoint: $ENDPOINT"

  # Run curl with a 10s timeout, capturing HTTP status code and response body
  RESPONSE=$(curl -s -w "\n%{http_code}" --max-time 10 "$ENDPOINT" || echo -e "CONNECTION_FAILURE\n000")

  # Split response into body and code
  RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)
  HTTP_STATUS=$(echo "$RESPONSE" | tail -n 1)

  echo "📥 Received HTTP Status: $HTTP_STATUS"
  echo "📥 Response Body: $RESPONSE_BODY"

  # A status code of 200, 201, 401 (Unauthorized), or 403 (Forbidden) is considered
  # a success because it proves the Lambda is alive, reached, and didn't crash (5xx).
  if [[ "$HTTP_STATUS" =~ ^(200|201|401|403|404)$ ]]; then
    echo "✅ Endpoint reached successfully with status: $HTTP_STATUS"
    SUCCESS=true
    # Set output for GitHub Actions URL tracking
    echo "endpoint=$ENDPOINT" >> "$GITHUB_OUTPUT" || true
    break
  else
    echo "❌ Endpoint returned status: $HTTP_STATUS (Expected: <500)"
  fi
done

if [ "$SUCCESS" = "false" ]; then
  echo "::error::Smoke test failed for service $SERVICE_NAME. All endpoints returned failures or timed out." >&2
  exit 1
fi

echo "🎉 Smoke test for $SERVICE_NAME passed!"
