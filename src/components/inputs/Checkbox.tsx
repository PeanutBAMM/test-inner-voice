import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function Checkbox({
  value,
  onValueChange,
  label,
  error,
  disabled = false,
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            value && styles.checkboxChecked,
            error && styles.checkboxError,
            disabled && styles.checkboxDisabled,
          ]}
        >
          {value && (
            <Ionicons
              name="checkmark"
              size={16}
              color={theme.colors.white}
            />
          )}
        </View>
        
        {label && (
          <Text
            style={[
              styles.label,
              disabled && styles.labelDisabled,
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxError: {
    borderColor: theme.colors.error,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  label: {
    marginLeft: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  labelDisabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginLeft: 32,
  },
});