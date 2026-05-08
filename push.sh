#!/bin/bash

# push.sh: Standard Git sync script
# Reference: Interview Project Sync Pattern

echo "🚀 Starting synchronization..."

# Check if we are in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository."
    exit 1
fi

# Add all changes
git add .

# Check for changes to commit
if git diff-index --quiet HEAD --; then
    echo "ℹ️ No changes to commit."
else
    # Auto-commit with timestamp
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    COMMIT_MSG="update: $TIMESTAMP"
    
    echo "📝 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
fi

# Push to origin
echo "⬆️ Pushing to origin..."
git push

echo "✅ Sync complete!"
