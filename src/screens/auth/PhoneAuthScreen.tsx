import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';
import { FormInput } from '@/components/inputs/FormInput';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { theme } from '@/constants/theme';
import useAuthStore from '@/store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneAuth'>;

export default function PhoneAuthScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [codeError, setCodeError] = useState('');
  
  const { loginWithPhone, verifyPhone } = useAuthStore();
  const codeInputRefs = useRef<TextInput[]>([]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as Dutch phone number
    let formatted = cleaned;
    if (cleaned.length > 0) {
      if (cleaned.startsWith('31')) {
        // International format
        formatted = '+' + cleaned;
      } else if (cleaned.startsWith('0')) {
        // National format
        formatted = cleaned;
      } else {
        // Add leading 0
        formatted = '0' + cleaned;
      }
    }
    
    return formatted;
  };

  const validatePhone = () => {
    const cleaned = phone.replace(/\D/g, '');
    
    // Check for valid Dutch phone number (10 digits starting with 0, or +31 followed by 9 digits)
    if (phone.startsWith('+31') && cleaned.length === 11) {
      return true;
    } else if (phone.startsWith('0') && cleaned.length === 10) {
      return true;
    }
    
    setPhoneError('Voer een geldig Nederlands telefoonnummer in');
    return false;
  };

  const handleSendCode = async () => {
    setPhoneError('');
    
    if (!validatePhone()) return;
    
    setIsLoading(true);
    try {
      const result = await loginWithPhone(phone);
      setSessionId(result.sessionId);
      setIsVerifying(true);
      
      Alert.alert(
        'Code Verzonden',
        'We hebben een verificatiecode naar je telefoon gestuurd.',
        [{ text: 'OK', onPress: () => codeInputRefs.current[0]?.focus() }]
      );
    } catch (error: any) {
      Alert.alert(
        'Fout',
        error.message || 'Er ging iets mis bij het verzenden van de code.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setCodeError('');
    
    if (verificationCode.length !== 6) {
      setCodeError('Voer een 6-cijferige code in');
      return;
    }
    
    setIsLoading(true);
    try {
      await verifyPhone(phone, verificationCode, sessionId);
      // Navigation handled by auth state
    } catch (error: any) {
      setCodeError('Onjuiste code. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/\D/g, '').slice(-1);
    
    // Update verification code
    const newCode = verificationCode.split('');
    newCode[index] = digit;
    setVerificationCode(newCode.join(''));
    
    // Auto-focus next input
    if (digit && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all digits entered
    if (digit && index === 5 && newCode.filter(d => d).length === 6) {
      handleVerifyCode();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Focus previous input on backspace
      codeInputRefs.current[index - 1]?.focus();
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Terug</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>
              {isVerifying ? 'Verifieer je nummer' : 'Login met telefoon'}
            </Text>
            <Text style={styles.subtitle}>
              {isVerifying 
                ? `We hebben een code gestuurd naar ${phone}`
                : 'Voer je telefoonnummer in om door te gaan'
              }
            </Text>
          </View>

          {!isVerifying ? (
            <View style={styles.form}>
              <FormInput
                label="Telefoonnummer"
                value={phone}
                onChangeText={(text) => setPhone(formatPhoneNumber(text))}
                error={phoneError}
                placeholder="06 12345678"
                keyboardType="phone-pad"
                icon="call"
              />

              <PrimaryButton
                title="Verstuur Code"
                onPress={handleSendCode}
                loading={isLoading}
                style={styles.button}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.codeLabel}>Verificatiecode</Text>
              <View style={styles.codeContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) codeInputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.codeInput,
                      verificationCode[index] && styles.codeInputFilled,
                      codeError && styles.codeInputError,
                    ]}
                    value={verificationCode[index] || ''}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    textAlign="center"
                  />
                ))}
              </View>
              
              {codeError ? (
                <Text style={styles.errorText}>{codeError}</Text>
              ) : null}

              <PrimaryButton
                title="Verifieer"
                onPress={handleVerifyCode}
                loading={isLoading}
                style={styles.button}
                disabled={verificationCode.length !== 6}
              />

              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleSendCode}
                disabled={isLoading}
              >
                <Text style={styles.resendButtonText}>
                  Code niet ontvangen? Opnieuw versturen
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {__DEV__ ? 'Dev mode: gebruik code 123456' : ''}
            </Text>
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
    marginBottom: theme.spacing.lg,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    marginBottom: theme.spacing.xl * 2,
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
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: theme.spacing.xl,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  codeInput: {
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
  codeInputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  codeInputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: theme.spacing.xl,
  },
  resendButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
});