#!/bin/bash

# Full App Check Script
# This script runs comprehensive checks on the entire application

echo "🚀 Starting Full App Check..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track overall status
OVERALL_STATUS=0

# Function to run a check
run_check() {
    local check_name=$1
    local check_command=$2
    
    echo -e "\n${BLUE}Running: ${check_name}${NC}"
    echo "--------------------------------"
    
    if eval $check_command; then
        echo -e "${GREEN}✅ ${check_name} passed${NC}"
    else
        echo -e "${RED}❌ ${check_name} failed${NC}"
        OVERALL_STATUS=1
    fi
}

# 1. TypeScript Type Check
run_check "TypeScript Type Check" "npx tsc --noEmit"

# 2. ESLint Check
run_check "ESLint Check" "npx eslint src --ext .ts,.tsx,.js,.jsx --max-warnings 0"

# 3. Prettier Format Check
echo -e "\n${BLUE}Running: Prettier Format Check${NC}"
echo "--------------------------------"
if npx prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"; then
    echo -e "${GREEN}✅ Prettier Format Check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Prettier Format Check failed - Run 'npm run format' to fix${NC}"
    OVERALL_STATUS=1
fi

# 4. Check for Circular Dependencies
echo -e "\n${BLUE}Running: Circular Dependencies Check${NC}"
echo "--------------------------------"
if npx madge --circular src 2>/dev/null | grep -q "No circular dependency found"; then
    echo -e "${GREEN}✅ No circular dependencies found${NC}"
else
    echo -e "${RED}❌ Circular dependencies detected${NC}"
    npx madge --circular src
    OVERALL_STATUS=1
fi

# 5. Check for Unused Dependencies
echo -e "\n${BLUE}Running: Unused Dependencies Check${NC}"
echo "--------------------------------"
npx depcheck --ignores="@types/*,@babel/*,babel-*,eslint-*,prettier,jest,@jest/*,metro-*,react-native-scripts" || true

# 6. Check for Outdated Dependencies
echo -e "\n${BLUE}Running: Outdated Dependencies Check${NC}"
echo "--------------------------------"
npm outdated || true

# 7. Bundle Size Analysis (if expo-cli is available)
if command -v expo &> /dev/null; then
    echo -e "\n${BLUE}Running: Bundle Size Analysis${NC}"
    echo "--------------------------------"
    npx expo export:web --analyze 2>/dev/null || echo "Bundle analysis not available"
fi

# 8. Security Audit
echo -e "\n${BLUE}Running: Security Audit${NC}"
echo "--------------------------------"
npm audit --production || true

# 9. Test Import Structure
echo -e "\n${BLUE}Running: Import Structure Check${NC}"
echo "--------------------------------"
# Check for absolute imports that should be relative
if grep -r "from '\.\./\.\./\.\./\.\." src/ --include="*.ts" --include="*.tsx" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Found deeply nested relative imports - Consider using absolute imports${NC}"
fi

# Check for unused imports (simple check)
if grep -r "import.*{.*}" src/ --include="*.ts" --include="*.tsx" | grep -E "{\s*}" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Found empty import statements${NC}"
else
    echo -e "${GREEN}✅ No empty imports found${NC}"
fi

# 10. Navigation Type Consistency Check
echo -e "\n${BLUE}Running: Navigation Type Check${NC}"
echo "--------------------------------"
# Check if all screens in RootNavigator are typed
NAVIGATOR_FILE="src/navigation/RootNavigator.tsx"
TYPES_FILE="src/types/navigation.ts"

if [ -f "$NAVIGATOR_FILE" ] && [ -f "$TYPES_FILE" ]; then
    # Extract screen names from navigator
    SCREENS=$(grep -oE "name=\"[^\"]+\"" "$NAVIGATOR_FILE" | sed 's/name="//g' | sed 's/"//g' | sort | uniq)
    
    # Check each screen in types
    MISSING_TYPES=""
    for screen in $SCREENS; do
        if ! grep -q "$screen:" "$TYPES_FILE"; then
            MISSING_TYPES="$MISSING_TYPES $screen"
        fi
    done
    
    if [ -z "$MISSING_TYPES" ]; then
        echo -e "${GREEN}✅ All navigation screens are properly typed${NC}"
    else
        echo -e "${RED}❌ Missing type definitions for screens:$MISSING_TYPES${NC}"
        OVERALL_STATUS=1
    fi
fi

# Final Summary
echo -e "\n================================"
if [ $OVERALL_STATUS -eq 0 ]; then
    echo -e "${GREEN}✨ All checks passed! Your app is in great shape!${NC}"
else
    echo -e "${RED}⚠️  Some checks failed. Please review the errors above.${NC}"
fi
echo "================================"

exit $OVERALL_STATUS