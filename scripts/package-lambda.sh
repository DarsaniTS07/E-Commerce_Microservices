#!/usr/bin/env bash
# ==============================================================================
# package-lambda.sh
# Packages a single service into a deployable ZIP archive.
#
# Usage:
#   bash scripts/package-lambda.sh <service_name> <output_dir>
#
# Example:
#   bash scripts/package-lambda.sh cart-service build
# ==============================================================================

set -euo pipefail

SERVICE_NAME="${1:-}"
OUTPUT_DIR="${2:-build}"

if [ -z "$SERVICE_NAME" ]; then
  echo "::error::Service name parameter is required." >&2
  exit 1
fi

echo "📦 Packaging service: $SERVICE_NAME"

# Determine path locations
ROOT_DIR="$(pwd)"
SERVICE_DIR="$ROOT_DIR/$SERVICE_NAME"
TARGET_ZIP="$ROOT_DIR/$OUTPUT_DIR/$SERVICE_NAME.zip"

if [ ! -d "$SERVICE_DIR" ]; then
  echo "::error::Service directory does not exist: $SERVICE_DIR" >&2
  exit 1
fi

# Create target directory if it does not exist
mkdir -p "$(dirname "$TARGET_ZIP")"

# Remove existing zip if it exists to avoid adding to old archives
rm -f "$TARGET_ZIP"

# Use temp directory for zipping to ensure clean environment
TEMP_ZIP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_ZIP_DIR"' EXIT

echo "📂 Creating clean package structure for $SERVICE_NAME..."

# Copy needed files to temp directory
cp -R "$SERVICE_DIR/src" "$TEMP_ZIP_DIR/src"
cp "$SERVICE_DIR/package.json" "$TEMP_ZIP_DIR/"
cp "$SERVICE_DIR/handler.js" "$TEMP_ZIP_DIR/"

if [ -d "$SERVICE_DIR/node_modules" ]; then
  cp -R "$SERVICE_DIR/node_modules" "$TEMP_ZIP_DIR/node_modules"
else
  echo "⚠️ node_modules not found in $SERVICE_NAME, running npm install --production..."
  cd "$TEMP_ZIP_DIR"
  npm install --omit=dev --prefer-offline
  cd "$ROOT_DIR"
fi

# If there is a package-lock.json, copy it
if [ -f "$SERVICE_DIR/package-lock.json" ]; then
  cp "$SERVICE_DIR/package-lock.json" "$TEMP_ZIP_DIR/"
fi

# Zip content of the temp directory
cd "$TEMP_ZIP_DIR"
zip -rq "$TARGET_ZIP" .

echo "✅ Successfully packaged $SERVICE_NAME into $TARGET_ZIP"
ls -lh "$TARGET_ZIP"
