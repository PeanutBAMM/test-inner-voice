#!/bin/bash
# Component generator for Apex apps

if [ -z "$1" ]; then
    echo "Usage: ./scripts/generate-component.sh ComponentName [category]"
    echo "Categories: cards, inputs, lists, feedback, layout"
    exit 1
fi

COMPONENT_NAME=$1
CATEGORY=${2:-"components"}
COMPONENT_DIR="src/components/$CATEGORY"

# Create directory if needed
mkdir -p "$COMPONENT_DIR"

# Generate component file
cat > "$COMPONENT_DIR/$COMPONENT_NAME.tsx" << EOF
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface ${COMPONENT_NAME}Props {
  // Add your props here
  title?: string;
  onPress?: () => void;
}

export default function $COMPONENT_NAME({ title, onPress }: ${COMPONENT_NAME}Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.title}>{title || '$COMPONENT_NAME'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text,
  },
});
EOF

# Update index.ts for exports
INDEX_FILE="$COMPONENT_DIR/index.ts"
if [ ! -f "$INDEX_FILE" ]; then
    echo "// Export all components from this directory" > "$INDEX_FILE"
fi

echo "export { default as $COMPONENT_NAME } from './$COMPONENT_NAME';" >> "$INDEX_FILE"

echo "✅ Component created: $COMPONENT_DIR/$COMPONENT_NAME.tsx"
echo "   You can now import it with:"
echo "   import { $COMPONENT_NAME } from '@/components/$CATEGORY';"