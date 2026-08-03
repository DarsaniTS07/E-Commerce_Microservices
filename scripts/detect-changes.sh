#!/usr/bin/env bash
# ==============================================================================
# detect-changes.sh
# Detects which microservices have changed between two git refs.
#
# Usage:
#   bash scripts/detect-changes.sh <base_sha> <head_sha>
#
# Output:
#   JSON array of changed service directory names, e.g.:
#   ["cart-service","payment-service"]
#
# Returns:
#   [] if no services changed
# ==============================================================================

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
SERVICES=(
  "cart-service"
  "event-service"
  "inventory-service"
  "notification-service"
  "order-service"
  "payment-service"
  "user-service"
  "waitlist-service"
)

BASE_SHA="${1:-}"
HEAD_SHA="${2:-HEAD}"

# ── Validate inputs ────────────────────────────────────────────────────────────
if [ -z "$BASE_SHA" ]; then
  echo "::error::Usage: detect-changes.sh <base_sha> <head_sha>" >&2
  exit 1
fi

# ── Get list of changed files ─────────────────────────────────────────────────
if ! git cat-file -e "${BASE_SHA}^{commit}" 2>/dev/null; then
  # base SHA doesn't exist (e.g. first push) — treat all services as changed
  echo "::warning::Base SHA not found. Treating all services as changed." >&2
  CHANGED_JSON=$(printf '%s\n' "${SERVICES[@]}" | jq -R . | jq -sc .)
  echo "$CHANGED_JSON"
  exit 0
fi

CHANGED_FILES=$(git diff --name-only "${BASE_SHA}" "${HEAD_SHA}" 2>/dev/null || git diff --name-only HEAD~1 HEAD)

# Also detect changes to shared scripts or workflows (force all changed)
WORKFLOW_CHANGED=false
if echo "$CHANGED_FILES" | grep -qE "^(scripts/|\.github/workflows/)"; then
  WORKFLOW_CHANGED=true
fi

# ── Detect which service directories changed ──────────────────────────────────
CHANGED_SERVICES=()

for SERVICE in "${SERVICES[@]}"; do
  if echo "$CHANGED_FILES" | grep -q "^${SERVICE}/"; then
    CHANGED_SERVICES+=("$SERVICE")
  fi
done

# If workflow files changed but no service files, still surface it in logs
if [ "$WORKFLOW_CHANGED" = "true" ] && [ ${#CHANGED_SERVICES[@]} -eq 0 ]; then
  echo "::notice::Workflow/script files changed but no service directories modified." >&2
fi

# ── Output JSON array ─────────────────────────────────────────────────────────
if [ ${#CHANGED_SERVICES[@]} -eq 0 ]; then
  echo "[]"
else
  printf '%s\n' "${CHANGED_SERVICES[@]}" | jq -R . | jq -sc .
fi
