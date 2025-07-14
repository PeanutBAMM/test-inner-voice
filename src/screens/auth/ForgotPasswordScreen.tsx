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
import { Ionicons } from '@expo/vector-icons';
import { AuthStackScreenProps } from '@/types/navigation';
import { FormInput } from '@/components/inputs/FormInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { theme } from '@/constants/theme';
import { validateEmail } from '@/utils/validation';
import api from '@/services/api';

type Props = AuthStackScreenProps<'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    if (!email) {
      setEmailError('Email is vereist');
      return false;
    } else if (!validateEmail(email)) {
      setEmailError('Ongeldig email adres');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSuccess(true);
    } catch (error) {
      Alert.alert(
        'Fout',
        'Er is iets misgegaan. Controleer je email adres en probeer opnieuw.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate({ key: 'Login' });
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
          </View>
          
          <Text style={styles.successTitle}>Check je email!</Text>
          <Text style={styles.successText}>
            We hebben een link gestuurd naar{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
          
          <Text style={styles.successSubtext}>
            Klik op de link in de email om je wachtwoord te resetten.
            Vergeet niet je spam folder te checken!
          </Text>

          <PrimaryButton
            title="Terug naar inloggen"
            onPress={handleBackToLogin}
            style={styles.backButton}
          />

          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => {
              setIsSuccess(false);
              handleResetPassword();
            }}
          >
            <Text style={styles.resendText}>Email niet ontvangen? Verstuur opnieuw</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Wachtwoord vergeten?</Text>
            <Text style={styles.subtitle}>
              Geen zorgen! Vul je email in en we sturen je instructies om je wachtwoord te resetten.
            </Text>
          </View>

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

            <PrimaryButton
              title="Reset link versturen"
              onPress={handleResetPassword}
              loading={isLoading}
              style={styles.resetButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Wachtwoord weer herinnerd?</Text>
            <TouchableOpacity onPress={handleBackToLogin}>
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
  backButton: {
    marginTop: theme.spacing.md,
  },
  header: {
    marginTop: theme.spacing.xl * 2,
    marginBottom: theme.spacing.xl * 1.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  resetButton: {
    marginTop: theme.spacing.xl,
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
  successContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: theme.spacing.xl,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  successText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emailText: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  successSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl * 2,
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 20,
  },
  resendButton: {
    marginTop: theme.spacing.lg,
  },
  resendText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});