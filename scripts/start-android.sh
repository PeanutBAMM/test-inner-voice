#!/bin/bash
# Start script for Android development with Expo and WSL

echo "🚀 Android Development Starter"
echo "=============================="

# Parse arguments
TUNNEL_MODE=false
EXPO_ARGS=""

for arg in "$@"; do
    case $arg in
        -t|--tunnel)
            TUNNEL_MODE=true
            EXPO_ARGS="$EXPO_ARGS --tunnel"
            ;;
        *)
            EXPO_ARGS="$EXPO_ARGS $arg"
            ;;
    esac
done

# Show mode
if [ "$TUNNEL_MODE" = true ]; then
    echo "🌐 Mode: Tunnel (works on emulator + phone)"
else
    echo "💻 Mode: Local (emulator only)"
fi

# Check if Windows ADB exists
if [ -f "/mnt/c/platform-tools/adb.exe" ]; then
    ADB_PATH="/mnt/c/platform-tools/adb.exe"
elif [ -f "/mnt/c/Users/$USER/AppData/Local/Android/Sdk/platform-tools/adb.exe" ]; then
    ADB_PATH="/mnt/c/Users/$USER/AppData/Local/Android/Sdk/platform-tools/adb.exe"
else
    echo "⚠️  Warning: ADB not found. Please ensure Android SDK is installed."
    echo "   Continuing anyway..."
    ADB_PATH="adb"
fi

# Check if emulator is running
echo "📱 Checking Android emulator..."
DEVICES=$($ADB_PATH devices 2>/dev/null | grep -E "emulator|device" | grep -v "List" || true)

if [ -z "$DEVICES" ]; then
    echo "❌ No Android emulator detected!"
    echo "   Please start your Android emulator from Android Studio first."
    echo "   Continuing anyway (you can still use Expo Go on your phone)..."
else
    echo "✅ Emulator found: $DEVICES"
fi

# Forward Metro bundler port (only needed for non-tunnel mode)
if [ "$TUNNEL_MODE" = false ] && [ ! -z "$DEVICES" ]; then
    echo "🔄 Forwarding Metro bundler port..."
    $ADB_PATH reverse tcp:8081 tcp:8081 2>/dev/null || true
    echo "✅ Port 8081 forwarded"
fi

# Navigate to project
cd "/mnt/c/Users/peanu/Documents/AI/Development/Apex Apps/TestInnerVoiceTemplateFixed"

# Start Expo
echo "🎬 Starting Expo..."
echo "   Press 'a' to open on Android"
echo "   Press 'r' to reload"
echo "   Press 'j' to open debugger"
if [ "$TUNNEL_MODE" = true ]; then
    echo "   📱 Scan QR code with Expo Go on your phone!"
fi
echo ""
npm start -- $EXPO_ARGS