#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
PACKAGE_NAME="youtube-content-blocker"
OUTPUT_DIR="$DIST_DIR/$PACKAGE_NAME"

rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

cp "$ROOT_DIR/manifest.json" "$OUTPUT_DIR/manifest.json"
cp -R "$ROOT_DIR/src" "$OUTPUT_DIR/src"
cp -R "$ROOT_DIR/popup" "$OUTPUT_DIR/popup"
cp -R "$ROOT_DIR/icons" "$OUTPUT_DIR/icons"

cd "$DIST_DIR"
rm -f "$PACKAGE_NAME.zip"
zip -rq "$PACKAGE_NAME.zip" "$PACKAGE_NAME"

echo "Created package at $DIST_DIR/$PACKAGE_NAME.zip"
echo "Contents:"
unzip -l "$PACKAGE_NAME.zip"
