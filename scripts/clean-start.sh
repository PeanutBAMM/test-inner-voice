#!/bin/bash
# Clean start script - clears cache and restarts Expo

echo "🧹 Clean Start Script"
echo "===================="

# Navigate to project
cd "/mnt/c/Users/peanu/Documents/AI/Development/Apex Apps/TestInnerVoiceTemplateFixed"

echo "🗑️  Clearing caches..."

# Clear Expo cache
expo start -c &

# Wait a moment for expo to start
sleep 3

# Kill the expo process (we just wanted to clear cache)
pkill -f "expo start" || true

# Clear Metro bundler cache
rm -rf $TMPDIR/metro-* || true
rm -rf $TMPDIR/haste-* || true

# Clear watchman cache (if installed)
if command -v watchman &> /dev/null; then
    echo "🔄 Clearing Watchman cache..."
    watchman watch-del-all
fi

echo "✅ Caches cleared!"
echo ""
echo "🚀 Starting fresh Expo session..."
echo ""

# Start Expo normally
npm start