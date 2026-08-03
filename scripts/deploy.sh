#!/usr/bin/env bash
# ==============================================================================
# deploy.sh
# Deploys a zipped Lambda package to AWS, publishes a new version, and updates
# the production alias.
#
# Usage:
#   bash scripts/deploy.sh <service_name> <zip_path> <aws_region>
#
# Example:
#   bash scripts/deploy.sh cart-service build/cart-service.zip ap-southeast-1
# ==============================================================================

set -euo pipefail

SERVICE_NAME="${1:-}"
ZIP_PATH="${2:-}"
REGION="${3:-ap-southeast-1}"
ALIAS_NAME="production"

if [ -z "$SERVICE_NAME" ] || [ -z "$ZIP_PATH" ]; then
  echo "::error::Service name and ZIP path are required parameters." >&2
  exit 1
fi

if [ ! -f "$ZIP_PATH" ]; then
  echo "::error::ZIP package not found at: $ZIP_PATH" >&2
  exit 1
fi

# ── Function Name Mapping ─────────────────────────────────────────────────────
get_function_name() {
  case "$1" in
    "event-service") echo "darsani_event-service" ;;
    "inventory-service") echo "darsani_inventory_service" ;;
    "cart-service") echo "darsani_cart_service" ;;
    "order-service") echo "darsani_order_service" ;;
    "payment-service") echo "darsani_payment_service" ;;
    "notification-service") echo "darsani_notification_service" ;;
    "waitlist-service") echo "darsani_waitlist_service" ;;
    "user-service") echo "darsani_user_service" ;;
    *) echo "darsani_${1//-/_}" ;;
  esac
}

FUNCTION_NAME=$(get_function_name "$SERVICE_NAME")
echo "🚀 Starting deployment for service: $SERVICE_NAME (Lambda: $FUNCTION_NAME) in region: $REGION"

# ── Get Previous Version for Rollback tracking ───────────────────────────────
PREVIOUS_VERSION="1"
if aws lambda get-alias --function-name "$FUNCTION_NAME" --name "$ALIAS_NAME" --region "$REGION" >/dev/null 2>&1; then
  PREVIOUS_VERSION=$(aws lambda get-alias --function-name "$FUNCTION_NAME" --name "$ALIAS_NAME" --region "$REGION" --query "FunctionVersion" --output text)
  echo "ℹ️ Current production alias points to version: $PREVIOUS_VERSION"
else
  echo "ℹ️ No production alias found. Will create one."
fi

# Save previous version for rollback script access
mkdir -p build/
echo "$PREVIOUS_VERSION" > "build/${SERVICE_NAME}-previous-version.txt"

# ── Upload ZIP and Publish Version ────────────────────────────────────────────
echo "📤 Uploading ZIP code and publishing new version..."
RESPONSE=$(aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file "fileb://$ZIP_PATH" \
  --publish \
  --region "$REGION" \
  --output json)

NEW_VERSION=$(echo "$RESPONSE" | jq -r '.Version')
echo "✅ Published new version: $NEW_VERSION"
echo "$NEW_VERSION" > "build/${SERVICE_NAME}-deployed-version.txt"

# ── Wait for Function Update to Complete ──────────────────────────────────────
echo "⏳ Waiting for function configuration update to be active..."
aws lambda wait function-updated --function-name "$FUNCTION_NAME" --region "$REGION"

# ── Update / Create Alias ─────────────────────────────────────────────────────
if aws lambda get-alias --function-name "$FUNCTION_NAME" --name "$ALIAS_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "🔄 Updating alias '$ALIAS_NAME' to version $NEW_VERSION..."
  aws lambda update-alias \
    --function-name "$FUNCTION_NAME" \
    --name "$ALIAS_NAME" \
    --function-version "$NEW_VERSION" \
    --region "$REGION" > /dev/null
else
  echo "🆕 Creating alias '$ALIAS_NAME' pointing to version $NEW_VERSION..."
  aws lambda create-alias \
    --function-name "$FUNCTION_NAME" \
    --name "$ALIAS_NAME" \
    --function-version "$NEW_VERSION" \
    --region "$REGION" > /dev/null
fi

echo "🎉 Deployment of $SERVICE_NAME completed successfully!"
