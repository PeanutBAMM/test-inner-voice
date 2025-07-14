import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface Country {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
}

const countries: Country[] = [
  { name: 'Netherlands', dial_code: '+31', code: 'NL', flag: '🇳🇱' },
  { name: 'United States', dial_code: '+1', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', dial_code: '+44', code: 'GB', flag: '🇬🇧' },
  { name: 'Germany', dial_code: '+49', code: 'DE', flag: '🇩🇪' },
  { name: 'France', dial_code: '+33', code: 'FR', flag: '🇫🇷' },
  { name: 'Spain', dial_code: '+34', code: 'ES', flag: '🇪🇸' },
  { name: 'Italy', dial_code: '+39', code: 'IT', flag: '🇮🇹' },
  { name: 'Belgium', dial_code: '+32', code: 'BE', flag: '🇧🇪' },
];

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onChangeCountry?: (country: Country) => void;
  error?: string;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChangeText,
  onChangeCountry,
  error,
  placeholder = 'Phone number',
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    onChangeCountry?.(country);
    setShowCountryPicker(false);
  };

  return (
    <View>
      <View style={[styles.container, error && styles.containerError]}>
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => setShowCountryPicker(true)}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCode}>{selectedCountry.dial_code}</Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textLight}
          keyboardType="phone-pad"
          autoCorrect={false}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountryPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCode}>{item.dial_code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  containerError: {
    borderColor: theme.colors.error,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  flag: {
    fontSize: 20,
  },
  dialCode: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  countryCode: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});