import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';
import useAuthStore from '@/store/useAuthStore';

interface BiometricAuthResult {
  isAvailable: boolean;
  biometricType: 'fingerprint' | 'facial' | 'iris' | 'none';
  isEnrolled: boolean;
  authenticate: () => Promise<boolean>;
  enableBiometric: () => Promise<boolean>;
}

export function useBiometricAuth(): BiometricAuthResult {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricAuthResult['biometricType']>('none');
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  const { loginWithBiometric, enableBiometric: enableBiometricInStore, biometricEnabled } = useAuthStore();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      // Check if device supports biometric authentication
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsAvailable(compatible);

      if (compatible) {
        // Check if biometrics are enrolled
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);

        // Get supported biometric types
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('facial');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('fingerprint');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          setBiometricType('iris');
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    if (!isAvailable || !isEnrolled) {
      Alert.alert(
        'Biometric Authenticatie',
        'Biometrische authenticatie is niet beschikbaar op dit apparaat.'
      );
      return false;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Bevestig je identiteit',
        cancelLabel: 'Annuleren',
        fallbackLabel: 'Gebruik wachtwoord',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Try to login with biometric
        await loginWithBiometric();
        return true;
      } else {
        if (result.error === 'user_cancel') {
          // User cancelled
        } else if (result.error === 'user_fallback') {
          // User chose to use password
        } else {
          Alert.alert(
            'Authenticatie Mislukt',
            'Biometrische authenticatie is mislukt. Probeer het opnieuw.'
          );
        }
        return false;
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const enableBiometric = async (): Promise<boolean> => {
    if (!isAvailable || !isEnrolled) {
      Alert.alert(
        'Biometric Setup',
        'Stel eerst biometrische beveiliging in op je apparaat om deze functie te gebruiken.',
        [
          { text: 'Annuleren', style: 'cancel' },
          { 
            text: 'Instellingen', 
            onPress: () => {
              // Note: Can't directly open settings in Expo Go
              Alert.alert(
                'Open Instellingen',
                'Ga naar je apparaatinstellingen en stel Face ID, Touch ID of vingerafdruk in.'
              );
            }
          }
        ]
      );
      return false;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Bevestig om biometrische login in te schakelen',
        cancelLabel: 'Annuleren',
        disableDeviceFallback: true,
      });

      if (result.success) {
        await enableBiometricInStore();
        Alert.alert(
          'Succes',
          'Biometrische authenticatie is ingeschakeld voor je account.'
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  };

  return {
    isAvailable,
    biometricType,
    isEnrolled,
    authenticate,
    enableBiometric,
  };
}