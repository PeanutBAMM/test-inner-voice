#!/bin/bash

echo "🔧 Fixing Expo Metro Bundling Issues (WSL + Android)"
echo "=================================================="

# 1. Check for Expo processes on emulator
echo "📱 Checking for Expo processes on Android emulator..."
/mnt/c/platform-tools/adb.exe shell ps | grep expo

# 2. Force stop Expo Go app
echo "🛑 Force stopping Expo Go app..."
/mnt/c/platform-tools/adb.exe shell am force-stop host.exp.exponent

# 3. Clear all Expo Go app data
echo "🧹 Clearing Expo Go app data..."
/mnt/c/platform-tools/adb.exe shell pm clear host.exp.exponent

# 4. Check for Metro/Expo processes on WSL
echo "🔍 Checking for Metro/Expo processes on WSL..."
ps aux | grep -E "metro|expo" | grep -v grep

# 5. Kill any running Metro/Expo processes
echo "⚡ Killing any running Metro/Expo processes..."
pkill -f metro || true
pkill -f expo || true

# 6. Remove .expo directory in project
echo "🗑️  Removing .expo directory..."
rm -rf .expo 2>/dev/null || true

# 7. Clear Metro cache
echo "🧹 Clearing Metro cache..."
npx react-native start --reset-cache &
sleep 5
pkill -f "react-native start" || true

# 8. Clear npm cache
echo "📦 Clearing npm cache..."
npm cache clean --force

# 9. Remove node_modules/.cache
echo "🗑️  Removing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || true

echo "✅ Bundling issues fixed! Now you can run 'npm start' again."
echo ""
echo "💡 If issues persist:"
echo "   1. Restart the Android emulator"
echo "   2. Run 'npm start -- --clear' instead of 'npm start'"
echo "   3. Check that your WSL IP is correct in the Metro URL"