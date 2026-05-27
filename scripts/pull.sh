#!/bin/bash

# pull.sh: Standard Git sync script
# Reference: Interview Project Sync Pattern

echo "🔄 Pulling latest changes from origin..."

# Check if we are in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository."
    exit 1
fi

# Pull from origin
git pull

echo "✅ Pull complete!"
