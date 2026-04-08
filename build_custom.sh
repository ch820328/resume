#!/bin/bash

# Helper script to build and export custom resume slides
# Usage: ./build_custom.sh <config_json_path>

CONFIG_PATH=$1

if [ -z "$CONFIG_PATH" ]; then
    echo "❌ Error: Please specify a configuration JSON path."
    echo "Usage: ./build_custom.sh <config_json_path>"
    exit 1
fi

if [ ! -f "$CONFIG_PATH" ]; then
    echo "❌ Error: Configuration file not found: $CONFIG_PATH"
    exit 1
fi

# 1. Parse suffix from JSON using grep/sed (since we don't assume jq is installed)
SUFFIX=$(grep -o '"suffix": *"[^"]*"' "$CONFIG_PATH" | cut -d'"' -f4)

if [ -z "$SUFFIX" ]; then
    echo "⚠️ Warning: No 'suffix' found in JSON. Defaulting to 'custom'."
    SUFFIX="custom"
fi

echo "🏗️  Starting custom build for suffix: $SUFFIX"

# 2. Build HTML
node scripts/build.js --config "$CONFIG_PATH"

# 3. Export PDF
node export_pdf.js "index_${SUFFIX}.html" "resume_slides_${SUFFIX}.pdf"

echo "✅ Custom release complete: resume_slides_${SUFFIX}.pdf"
