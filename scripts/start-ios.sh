#!/bin/bash
# Start script for iOS development (macOS only)

echo "🍎 iOS Development Starter"
echo "========================="

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: iOS development requires macOS"
    echo "   Please use an Apple computer with Xcode installed."
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: Xcode not found"
    echo "   Please install Xcode from the Mac App Store."
    exit 1
fi

# Navigate to project
cd "/mnt/c/Users/peanu/Documents/AI/Development/Apex Apps/TestInnerVoiceTemplateFixed"

# Check for iOS simulator
echo "📱 Checking iOS simulators..."
xcrun simctl list devices available | grep -q "iPhone" || {
    echo "❌ No iOS simulators found!"
    echo "   Please open Xcode and download a simulator."
    exit 1
}

echo "✅ iOS development environment ready!"
echo ""
echo "🎬 Starting Expo..."
echo "   Press 'i' to open on iOS simulator"
echo "   Press 'r' to reload"
echo "   Press 'j' to open debugger"
echo ""

# Start Expo
npm start