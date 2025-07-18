import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ThemeSelectorProps {
  selectedTheme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme = 'system',
  onThemeChange,
}) => {
  const themes = [
    { value: 'light', label: 'Light', color: '#FFFFFF' },
    { value: 'dark', label: 'Dark', color: '#1F2937' },
    { value: 'system', label: 'System', color: '#6B7280' },
  ] as const;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme</Text>
      <View style={styles.options}>
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.value}
            style={[styles.option, selectedTheme === theme.value && styles.selected]}
            onPress={() => onThemeChange?.(theme.value)}
          >
            <View
              style={[
                styles.preview,
                { backgroundColor: theme.color },
                theme.value === 'light' && styles.lightBorder,
              ]}
            />
            <Text style={styles.optionText}>{theme.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    gap: 12,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  selected: {
    borderColor: '#4ADE80',
    backgroundColor: '#F0FDF4',
  },
  preview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  lightBorder: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  optionText: {
    fontSize: 12,
    color: '#374151',
  },
});
