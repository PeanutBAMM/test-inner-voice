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

type Props = NativeStackScreenProps<AuthStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+31');
  
  const { resetOnboarding } = useAppStore();
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
          }
        }
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
          phoneNumber: fullPhoneNumber 
        });
      } else {
        // Direct login successful - navigation will happen automatically
        // when RootNavigator detects authentication status change
        await AsyncStorage.setItem('triggerReload', 'true');
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
      
      // Successful login - trigger navigation update
      // The RootNavigator will automatically navigate to OnboardingChat
      // when it detects the authentication status change
      await AsyncStorage.setItem('triggerReload', 'true');
    } catch (error) {
      Alert.alert('Login Error', 'Something went wrong during login. Please try again.');
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
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <AuthIllustration size={180} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.subtitle}>
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
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Phone Input Section */}
          <View style={styles.phoneSection}>
            <Text style={styles.inputLabel}>Phone Number</Text>
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
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Skip for now */}
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={async () => {
              setIsLoading(true);
              try {
                await mockAuthService.loginAsGuest();
                navigation.navigate('OnboardingChat' as any);
              } catch (error) {
                Alert.alert('Error', 'Something went wrong. Please try again.');
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>

          {/* Development Quick Login (dev only) */}
          {isDev && (
            <View style={styles.devSection}>
              <Text style={styles.devSectionTitle}>🚀 Development Quick Login</Text>
              <View style={styles.devButtonRow}>
                <TouchableOpacity 
                  style={styles.devButton}
                  onPress={async () => {
                    setIsLoading(true);
                    try {
                      await mockAuthService.quickLogin('user');
                      navigation.navigate('OnboardingChat' as any);
                    } catch (error) {
                      Alert.alert('Error', 'Quick login failed');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  <Text style={styles.devButtonText}>👤 Test User</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.devButton}
                  onPress={async () => {
                    setIsLoading(true);
                    try {
                      await mockAuthService.quickLogin('admin');
                      navigation.navigate('OnboardingChat' as any);
                    } catch (error) {
                      Alert.alert('Error', 'Quick login failed');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                >
                  <Text style={styles.devButtonText}>⚡ Admin</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.backToOnboardingButton}
                onPress={handleBackToOnboarding}
              >
                <Text style={styles.backToOnboardingText}>🔙 Terug naar onboarding</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.textSecondary,
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
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  phoneSection: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.text,
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
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  skipText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: '600',
  },
  devSection: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.warning + '10',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  devSectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.warning,
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
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  devButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  backToOnboardingButton: {
    alignSelf: 'center',
    backgroundColor: Colors.warning + '20',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backToOnboardingText: {
    color: Colors.warning,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
});