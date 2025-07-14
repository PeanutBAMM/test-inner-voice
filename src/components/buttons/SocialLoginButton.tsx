import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

type Provider = 'google' | 'apple' | 'facebook' | 'email';

interface SocialLoginButtonProps {
  provider: Provider;
  onPress: () => void;
  style?: ViewStyle;
}

const providerConfig = {
  google: {
    icon: 'logo-google' as const,
    text: 'Continue with Google',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    iconColor: '#4285F4',
  },
  apple: {
    icon: 'logo-apple' as const,
    text: 'Continue with Apple',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
  },
  facebook: {
    icon: 'logo-facebook' as const,
    text: 'Continue with Facebook',
    backgroundColor: '#1877F2',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
  },
  email: {
    icon: 'mail' as const,
    text: 'Continue with Email',
    backgroundColor: theme.colors.surface,
    textColor: theme.colors.text,
    iconColor: theme.colors.text,
  },
};

export function SocialLoginButton({ provider, onPress, style }: SocialLoginButtonProps) {
  const config = providerConfig[provider];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: config.backgroundColor },
        provider !== 'apple' && provider !== 'facebook' && styles.buttonBorder,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Ionicons
          name={config.icon}
          size={20}
          color={config.iconColor}
          style={styles.icon}
        />
        <Text style={[styles.text, { color: config.textColor }]}>
          {config.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    width: '100%',
  },
  buttonBorder: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});