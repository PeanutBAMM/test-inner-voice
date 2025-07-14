import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ChatBubbleStylesProps {
  selectedStyle?: 'minimal' | 'rounded' | 'glass';
  onStyleChange?: (style: 'minimal' | 'rounded' | 'glass') => void;
}

export const ChatBubbleStyles: React.FC<ChatBubbleStylesProps> = ({
  selectedStyle = 'rounded',
  onStyleChange,
}) => {
  const styles = ['minimal', 'rounded', 'glass'] as const;

  return (
    <View style={componentStyles.container}>
      <Text style={componentStyles.title}>Chat Bubble Style</Text>
      <View style={componentStyles.options}>
        {styles.map((style) => (
          <TouchableOpacity
            key={style}
            style={[
              componentStyles.option,
              selectedStyle === style && componentStyles.selected,
            ]}
            onPress={() => onStyleChange?.(style)}
          >
            <Text style={componentStyles.optionText}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const componentStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F2937',
  },
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  selected: {
    borderColor: '#4ADE80',
    backgroundColor: '#F0FDF4',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
});