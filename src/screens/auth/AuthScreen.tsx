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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { PhoneInput } from '../../components/inputs/PhoneInput';
import { SocialLoginButton } from '../../components/buttons/SocialLoginButton';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { AuthIllustration } from '../../components/illustrations/AuthIllustration';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppStore from '../../store/useAppStore';
import mockAuthService from '../../services/auth/mockAuthService';
import { UniversalBackground } from '../../components/backgrounds/UniversalBackground';
import { useTheme } from '../../contexts/ThemeContext';

// type Props = NativeStackScreenProps<AuthStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+31');

  const { resetOnboarding } = useAppStore();
  const { theme } = useTheme();
  const isDev = __DEV__;

  const handleBackToOnboarding = () => {
    Alert.alert(
      'Terug naar Onboarding',
      'Weet je zeker dat je terug wilt naar het onboarding proces?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Ja, ga terug',
          onPress: () => {
            resetOnboarding();
          },
        },
      ]
    );
  };

  const validatePhone = () => {
    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (phoneNumber.length < 8) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleContinue = async () => {
    if (!validatePhone()) return;

    setIsLoading(true);
    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const result = await mockAuthService.loginWithPhone(fullPhoneNumber);

      if (result.requiresOTP) {
        // Navigate to OTP screen (not implemented in mock)
        navigation.navigate('OTPVerification', {
          phoneNumber: fullPhoneNumber,
        });
      } else {
        // Direct login successful - navigation will happen automatically
        // when RootNavigator detects authentication status change
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook' | 'email') => {
    setIsLoading(true);
    try {
      const user = await mockAuthService.loginWithProvider(provider);

      // Successful login - navigation will happen automatically
      // when RootNavigator detects authentication status change
    } catch (error) {
      Alert.alert('Login Error', 'Something went wrong during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UniversalBackground
      variant="modern"
      mood="peaceful"
      timeOfDay="afternoon"
      enableEffects={false}
    >
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
            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <AuthIllustration size={180} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Log in or create an account to continue to InnerVoice
              </Text>
            </View>

            {/* Social Login Section */}
            <View style={styles.socialSection}>
              <SocialLoginButton
                provider="google"
                onPress={() => handleSocialLogin('google')}
                style={styles.socialButton}
              />
              <SocialLoginButton
                provider="apple"
                onPress={() => handleSocialLogin('apple')}
                style={styles.socialButton}
              />
              <SocialLoginButton
                provider="facebook"
                onPress={() => handleSocialLogin('facebook')}
                style={styles.socialButton}
              />
              <SocialLoginButton
                provider="email"
                onPress={() => navigation.navigate('Login')}
                style={styles.socialButton}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Phone Input Section */}
            <View style={styles.phoneSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Phone Number</Text>
              <PhoneInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onChangeCountry={(country: any) => setCountryCode(country.dial_code)}
                error={phoneError}
                placeholder="Enter your phone number"
              />

              <PrimaryButton
                title="Continue"
                onPress={handleContinue}
                loading={isLoading}
                style={styles.continueButton}
              />
            </View>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                By continuing, you agree to our{' '}
                <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            {/* Skip for now */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={async () => {
                setIsLoading(true);
                try {
                  await mockAuthService.loginAsGuest();
                  // Navigation will happen automatically via RootNavigator
                } catch (error) {
                  Alert.alert('Error', 'Something went wrong. Please try again.');
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <Text style={[styles.skipText, { color: theme.colors.primary }]}>Skip for now</Text>
            </TouchableOpacity>

            {/* Development Quick Login (dev only) */}
            {isDev && (
              <View
                style={[
                  styles.devSection,
                  {
                    backgroundColor: theme.colors.warning + '10',
                    borderColor: theme.colors.warning + '30',
                  },
                ]}
              >
                <Text style={[styles.devSectionTitle, { color: theme.colors.warning }]}>
                  🚀 Development Quick Login
                </Text>
                <View style={styles.devButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.devButton,
                      {
                        backgroundColor: theme.colors.primary + '20',
                        borderColor: theme.colors.primary + '40',
                      },
                    ]}
                    onPress={async () => {
                      setIsLoading(true);
                      try {
                        await mockAuthService.quickLogin('user');
                        // Clear onboarding for this test user
                        await AsyncStorage.removeItem('onboardingCompleted');
                        // Trigger RootNavigator to re-check status
                        await AsyncStorage.setItem('triggerReload', Date.now().toString());
                        // Navigation will happen automatically via RootNavigator
                      } catch (error) {
                        Alert.alert('Error', 'Quick login failed');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    <Text style={[styles.devButtonText, { color: theme.colors.primary }]}>
                      👤 Onboarding User
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.devButton,
                      {
                        backgroundColor: theme.colors.primary + '20',
                        borderColor: theme.colors.primary + '40',
                      },
                    ]}
                    onPress={async () => {
                      setIsLoading(true);
                      try {
                        await mockAuthService.quickLogin('admin');
                        // Navigation will happen automatically via RootNavigator
                      } catch (error) {
                        Alert.alert('Error', 'Quick login failed');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    <Text style={[styles.devButtonText, { color: theme.colors.primary }]}>
                      ⚡ Admin
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.backToOnboardingButton,
                    {
                      backgroundColor: theme.colors.warning + '20',
                    },
                  ]}
                  onPress={handleBackToOnboarding}
                >
                  <Text style={[styles.backToOnboardingText, { color: theme.colors.warning }]}>
                    🔙 Terug naar onboarding
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </UniversalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl * 1.5,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  socialSection: {
    gap: Spacing.md,
  },
  socialButton: {
    marginBottom: Spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  phoneSection: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  continueButton: {
    marginTop: Spacing.lg,
  },
  termsContainer: {
    marginBottom: Spacing.xl,
  },
  termsText: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  skipText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
  devSection: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  devSectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  devButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  devButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  devButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  backToOnboardingButton: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backToOnboardingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
});
