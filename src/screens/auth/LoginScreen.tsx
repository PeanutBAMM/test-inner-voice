import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { FormInput } from '@/components/inputs/FormInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { theme } from '@/constants/theme';
import useAuthStore from '@/store/useAuthStore';
import { validateEmail } from '@/utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loginWithGoogle } = useAuthStore();
  
  // Development test credentials
  const TEST_EMAIL = 'test@example.com';
  const TEST_PASSWORD = 'Niquegek$11';
  const isDev = __DEV__;

  const handleUseTestAccount = () => {
    setEmail(TEST_EMAIL);
    setPassword(TEST_PASSWORD);
    setEmailError('');
    setPasswordError('');
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!email) {
      setEmailError('Email is vereist');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Ongeldig email adres');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError('Wachtwoord is vereist');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Wachtwoord moet minimaal 6 karakters zijn');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation handled by auth state change
    } catch (error: any) {
      console.warn('[LoginScreen] Login failed:', error.message);
      let errorMessage = 'Controleer je email en wachtwoord en probeer opnieuw.';
      
      // Handle specific Supabase errors
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Onjuiste email of wachtwoord.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Bevestig eerst je email adres.';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Geen internetverbinding. Probeer het later opnieuw.';
      }
      
      Alert.alert('Login Mislukt', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      // OAuth redirect will handle the rest
    } catch (error: any) {
      console.error('Google login error:', error);
      Alert.alert(
        'Google Login Mislukt',
        'Er ging iets mis met Google login. Probeer het later opnieuw.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welkom terug</Text>
            <Text style={styles.subtitle}>Log in om door te gaan</Text>
          </View>

          {isDev && (
            <TouchableOpacity
              style={styles.testAccountButton}
              onPress={handleUseTestAccount}
            >
              <Text style={styles.testAccountText}>🧪 Gebruik test account</Text>
            </TouchableOpacity>
          )}

          <View style={styles.form}>
            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              placeholder="jouw@email.nl"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              icon="mail"
            />

            <FormInput
              label="Wachtwoord"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              onToggleSecure={() => setShowPassword(!showPassword)}
              showSecureToggle
              icon="lock-closed"
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                Wachtwoord vergeten?
              </Text>
            </TouchableOpacity>

            <PrimaryButton
              title="Inloggen"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OF</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                <Text style={styles.socialButtonText}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, styles.socialButtonDisabled]}
                disabled
              >
                <Text style={styles.socialButtonText}>f</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, styles.socialButtonDisabled]}
                disabled
              >
                <Text style={styles.socialButtonText}>🍎</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Nog geen account?</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupLink}>Registreren</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginHorizontal: theme.spacing.md,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing.xl * 1.5,
    marginTop: theme.spacing.xl * 2,
  },
  keyboardView: {
    flex: 1,
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  signupLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  socialButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  socialButtonDisabled: {
    opacity: 0.5,
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'center',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  testAccountButton: {
    alignSelf: 'center',
    backgroundColor: theme.colors.warning + '20',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  testAccountText: {
    color: theme.colors.warning,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
});