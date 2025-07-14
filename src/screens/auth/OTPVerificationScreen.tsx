import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { theme } from '@/constants/theme';
import useAuthStore from '@/store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

export default function OTPVerificationScreen({ route, navigation }: Props) {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  
  const { login } = useAuthStore();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit) && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const verificationCode = code || otp.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      // In development, accept 123456 as valid code
      if (__DEV__ && verificationCode === '123456') {
        await login('test@example.com', 'password');
        // Navigation handled by auth state
      } else if (!__DEV__) {
        // In production, would verify with backend
        Alert.alert('Error', 'OTP verification not implemented');
      } else {
        Alert.alert('Error', 'Invalid code. Use 123456 in development.');
      }
    } catch (error) {
      Alert.alert('Error', 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    Alert.alert('Code Sent', 'A new verification code has been sent.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a code to {phoneNumber}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                textAlign="center"
              />
            ))}
          </View>

          <PrimaryButton
            title="Verify"
            onPress={() => handleVerify()}
            loading={isLoading}
            style={styles.verifyButton}
            disabled={!otp.every(digit => digit)}
          />

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResend}
            disabled={isLoading}
          >
            <Text style={styles.resendText}>
              Didn&apos;t receive code? <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>

          {__DEV__ && (
            <View style={styles.devNote}>
              <Text style={styles.devNoteText}>Dev: Use code 123456</Text>
            </View>
          )}
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  backButton: {
    marginBottom: theme.spacing.xl,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl * 2,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl * 2,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  otpInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  verifyButton: {
    marginBottom: theme.spacing.xl,
  },
  resendButton: {
    alignSelf: 'center',
  },
  resendText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  devNote: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    alignSelf: 'center',
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  devNoteText: {
    color: theme.colors.warning,
    fontSize: 12,
    fontWeight: '600',
  },
});