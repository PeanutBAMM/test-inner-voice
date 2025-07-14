import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useUserStore from '../../store/innervoice/useUserStore';

const languages = [
  { code: 'Nederlands', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'English', label: 'English', flag: '🇬🇧' },
];

export default function LanguageSettingsScreen() {
  const navigation = useNavigation();
  const { userProfile, updateUserProfile } = useUserStore();
  const [selectedLanguage, setSelectedLanguage] = useState(
    userProfile?.preferredLanguage || 'Nederlands'
  );

  const handleLanguageSelect = (language: 'Nederlands' | 'English') => {
    setSelectedLanguage(language);
    updateUserProfile({ preferredLanguage: language });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(232, 223, 253, 0.3)', 'rgba(255, 255, 255, 0)']}
        style={styles.gradient}
      />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#8B7BA7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Taalinstellingen</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Kies je taal</Text>
        <Text style={styles.sectionDescription}>
          Selecteer de taal waarin je wilt communiceren met je innerlijke gids.
        </Text>

        <View style={styles.languageOptions}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageOption,
                selectedLanguage === language.code && styles.languageOptionSelected,
              ]}
              onPress={() => handleLanguageSelect(language.code as 'Nederlands' | 'English')}
            >
              <View style={styles.languageInfo}>
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <Text style={[
                  styles.languageLabel,
                  selectedLanguage === language.code && styles.languageLabelSelected,
                ]}>
                  {language.label}
                </Text>
              </View>
              {selectedLanguage === language.code && (
                <Ionicons name="checkmark-circle" size={24} color="#8B7BA7" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#8B7BA7" />
          <Text style={styles.infoText}>
            De taalinstelling wordt direct toegepast op alle gesprekken en menu&apos;s.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 223, 253, 0.3)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4458',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A4458',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B627D',
    marginBottom: 24,
    lineHeight: 20,
  },
  languageOptions: {
    gap: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 253, 0.5)',
    marginBottom: 12,
  },
  languageOptionSelected: {
    borderColor: '#8B7BA7',
    backgroundColor: 'rgba(232, 223, 253, 0.1)',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageLabel: {
    fontSize: 16,
    color: '#4A4458',
  },
  languageLabelSelected: {
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(232, 223, 253, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#6B627D',
    lineHeight: 20,
  },
});