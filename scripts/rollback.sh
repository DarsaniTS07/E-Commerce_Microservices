#!/usr/bin/env bash
# ==============================================================================
# rollback.sh
# Performs automatic rollback of a Lambda function's production alias to the
# previous stable version on deployment or smoke test failure.
#
# Usage:
#   bash scripts/rollback.sh <service_name> <aws_region>
#
# Example:
#   bash scripts/rollback.sh cart-service ap-southeast-1
# ==============================================================================

set -euo pipefail

SERVICE_NAME="${1:-}"
REGION="${2:-ap-southeast-1}"
ALIAS_NAME="production"

if [ -z "$SERVICE_NAME" ]; then
  echo "::error::Service name is a required parameter." >&2
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
echo "⚠️ Initiating rollback process for service: $SERVICE_NAME (Lambda: $FUNCTION_NAME)"

# ── Retrieve Previous Version ────────────────────────────────────────────────
ROLLBACK_VERSION=""

# Method 1: Read from local state file generated during deploy.sh
VERSION_FILE="build/${SERVICE_NAME}-previous-version.txt"
if [ -f "$VERSION_FILE" ]; then
  ROLLBACK_VERSION=$(cat "$VERSION_FILE")
  echo "ℹ️ Found recorded previous version in local state: $ROLLBACK_VERSION"
fi

# Method 2: Fallback to querying AWS API for the second latest version
if [ -z "$ROLLBACK_VERSION" ] || [ "$ROLLBACK_VERSION" = "null" ]; then
  echo "⚠️ State file not found or empty. Querying AWS for version list..."
  # List versions sorted and fetch second to last version (the one before the failed deployment)
  VERSIONS=$(aws lambda list-versions-by-function \
    --function-name "$FUNCTION_NAME" \
    --region "$REGION" \
    --query "Versions[?Version!='\$LATEST'].Version" \
    --output json)

  COUNT=$(echo "$VERSIONS" | jq '. | length')

  if [ "$COUNT" -le 1 ]; then
    echo "::warning::Only one version exists. Cannot roll back. Defaulting to version 1."
    ROLLBACK_VERSION="1"
  else
    # Get second to last element index (COUNT - 2)
    TARGET_INDEX=$((COUNT - 2))
    ROLLBACK_VERSION=$(echo "$VERSIONS" | jq -r ".[$TARGET_INDEX]")
    echo "ℹ️ AWS query identified previous stable version: $ROLLBACK_VERSION"
  fi
fi

# ── Perform Rollback ──────────────────────────────────────────────────────────
if [ -n "$ROLLBACK_VERSION" ]; then
  echo "🔄 Reverting alias '$ALIAS_NAME' to point back to version $ROLLBACK_VERSION..."

  aws lambda update-alias \
    --function-name "$FUNCTION_NAME" \
    --name "$ALIAS_NAME" \
    --function-version "$ROLLBACK_VERSION" \
    --region "$REGION"

  echo "✅ Rollback completed successfully! $SERVICE_NAME is now pointing to version $ROLLBACK_VERSION."
else
  echo "::error::Failed to determine rollback version. Manual intervention required."
  exit 1
fi
