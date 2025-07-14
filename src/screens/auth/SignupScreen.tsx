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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '@/types/navigation';
import { FormInput } from '@/components/inputs/FormInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { Checkbox } from '@/components/inputs/Checkbox';
import { theme } from '@/constants/theme';
import useAuthStore from '@/store/useAuthStore';
import { validateEmail, validatePassword } from '@/utils/validation';

type Props = AuthStackScreenProps<'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signup } = useAuthStore();

  const validateForm = () => {
    let isValid = true;
    
    if (!name || name.length < 2) {
      setNameError('Naam moet minimaal 2 karakters zijn');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!email) {
      setEmailError('Email is vereist');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Ongeldig email adres');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message);
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError('Wachtwoorden komen niet overeen');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    if (!acceptTerms) {
      setTermsError('Je moet de voorwaarden accepteren');
      isValid = false;
    } else {
      setTermsError('');
    }
    
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await signup(email, password, name);
      // TODO: Save marketing email preference
      // Navigation handled by auth state change
    } catch (error) {
      Alert.alert(
        'Registratie Mislukt',
        'Er is iets misgegaan. Probeer het later opnieuw.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate({ key: 'Login' });
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, color: theme.colors.border };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const colors = [
      theme.colors.border,
      theme.colors.error,
      theme.colors.warning,
      theme.colors.success,
      theme.colors.primary,
    ];
    
    return { strength, color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength();

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
            <Text style={styles.title}>Account aanmaken</Text>
            <Text style={styles.subtitle}>Begin je reis met ons</Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Volledige naam"
              value={name}
              onChangeText={setName}
              error={nameError}
              placeholder="Jan Jansen"
              autoCapitalize="words"
              icon="person"
            />

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

            {password && (
              <View style={styles.passwordStrength}>
                <View style={styles.strengthBars}>
                  {[0, 1, 2, 3].map((index) => (
                    <View
                      key={index}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            index < passwordStrength.strength
                              ? passwordStrength.color
                              : theme.colors.border,
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.strengthText}>
                  {['Zwak', 'Matig', 'Goed', 'Sterk'][passwordStrength.strength - 1] || 'Te zwak'}
                </Text>
              </View>
            )}

            <FormInput
              label="Bevestig wachtwoord"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPasswordError}
              placeholder="••••••••"
              secureTextEntry={!showConfirmPassword}
              onToggleSecure={() => setShowConfirmPassword(!showConfirmPassword)}
              showSecureToggle
              icon="lock-closed"
            />

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={acceptTerms}
                onValueChange={setAcceptTerms}
                label="Ik ga akkoord met de algemene voorwaarden"
                error={termsError}
              />
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={marketingEmails}
                onValueChange={setMarketingEmails}
                label="Stuur mij tips en aanbiedingen"
              />
            </View>

            <PrimaryButton
              title="Account aanmaken"
              onPress={handleSignup}
              loading={isLoading}
              style={styles.signupButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Heb je al een account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Inloggen</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    marginTop: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl * 1.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  passwordStrength: {
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  checkboxContainer: {
    marginBottom: theme.spacing.md,
  },
  signupButton: {
    marginTop: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.xs,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});