import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import useUserStore from '../../store/innervoice/useUserStore';
import useSubscriptionStore from '../../store/innervoice/useSubscriptionStore';
import useAppStore from '../../store/useAppStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'action' | 'navigation';
  icon: keyof typeof Ionicons.glyphMap;
  value?: boolean;
  onPress?: () => void;
}

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { userProfile, updateUserProfile } = useUserStore();
  const { tier, restorePurchases } = useSubscriptionStore();
  const { theme, toggleTheme } = useAppStore();

  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userProfile?.notificationPreference !== 'Nee, ik kom wel als ik er behoefte aan heb'
  );
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const [cloudBackupEnabled, setCloudBackupEnabled] = useState(false);

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert(
          'Biometrie niet beschikbaar',
          'Je apparaat ondersteunt geen biometrische beveiliging of je hebt het nog niet ingesteld.'
        );
        return;
      }
    }

    setBiometricEnabled(value);
    await AsyncStorage.setItem('biometricEnabled', value.toString());
  };

  const handleClearData = () => {
    Alert.alert(
      'Weet je het zeker?',
      'Alle lokale data wordt verwijderd. Dit kan niet ongedaan worden gemaakt.',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Verwijderen',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            // Reset app
            navigation.reset({
              index: 0,
              routes: [{ name: 'OnboardingChat' }],
            });
          },
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert('Succes', 'Aankopen zijn hersteld.');
    } catch (error) {
      Alert.alert('Fout', 'Kon aankopen niet herstellen.');
    }
  };

  const privacySettings: SettingItem[] = [
    {
      id: 'biometric',
      title: 'Biometrische toegang',
      subtitle: 'Gebruik Face ID of Touch ID',
      type: 'toggle',
      icon: 'finger-print',
      value: biometricEnabled,
      onPress: () => handleBiometricToggle(!biometricEnabled),
    },
    {
      id: 'cloudBackup',
      title: 'Cloud backup',
      subtitle: tier.type === 'premium' ? 'Automatisch back-uppen' : 'Premium functie',
      type: 'toggle',
      icon: 'cloud-outline',
      value: cloudBackupEnabled,
      onPress: () => {
        if (tier.type === 'free') {
          navigation.navigate('UpgradeModal', {
            reason: 'Cloud backup is alleen voor Premium gebruikers',
          });
        } else {
          setCloudBackupEnabled(!cloudBackupEnabled);
        }
      },
    },
  ];

  const appSettings: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Notificaties',
      subtitle: 'Dagelijkse herinneringen',
      type: 'toggle',
      icon: 'notifications-outline',
      value: notificationsEnabled,
      onPress: () => setNotificationsEnabled(!notificationsEnabled),
    },
    {
      id: 'darkMode',
      title: 'Donkere modus',
      subtitle: 'Mannelijke energy kleuren',
      type: 'toggle',
      icon: theme === 'dark' ? 'sunny-outline' : 'moon-outline',
      value: theme === 'dark',
      onPress: toggleTheme,
    },
    {
      id: 'voiceOutput',
      title: 'Spraak output',
      subtitle: tier.type === 'premium' ? 'Coach praat terug' : 'Premium functie',
      type: 'toggle',
      icon: 'volume-high-outline',
      value: voiceOutputEnabled,
      onPress: () => {
        if (tier.type === 'free') {
          navigation.navigate('UpgradeModal', {
            reason: 'Spraak output is alleen voor Premium gebruikers',
          });
        } else {
          setVoiceOutputEnabled(!voiceOutputEnabled);
        }
      },
    },
    {
      id: 'language',
      title: 'Taal',
      subtitle: userProfile?.preferredLanguage || 'Nederlands',
      type: 'navigation',
      icon: 'language-outline',
      onPress: () => navigation.navigate('LanguageSettingsScreen'),
    },
  ];

  const dataSettings: SettingItem[] = [
    {
      id: 'export',
      title: 'Exporteer gesprekken',
      type: 'action',
      icon: 'download-outline',
      onPress: () =>
        Alert.alert('Binnenkort beschikbaar', 'Deze functie komt in een volgende update.'),
    },
    {
      id: 'clearData',
      title: 'Wis alle data',
      type: 'action',
      icon: 'trash-outline',
      onPress: handleClearData,
    },
  ];

  const accountSettings: SettingItem[] = [
    {
      id: 'restorePurchases',
      title: 'Herstel aankopen',
      type: 'action',
      icon: 'refresh-outline',
      onPress: handleRestorePurchases,
    },
    {
      id: 'privacy',
      title: 'Privacybeleid',
      type: 'navigation',
      icon: 'shield-checkmark-outline',
      onPress: () => navigation.navigate('PrivacyPolicyScreen'),
    },
    {
      id: 'terms',
      title: 'Gebruiksvoorwaarden',
      type: 'navigation',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('TermsOfServiceScreen'),
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={24} color="#8B7BA7" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
        </View>
      </View>

      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#E8DFFD', true: '#C3B5E3' }}
          thumbColor={item.value ? '#8B7BA7' : '#f4f3f4'}
        />
      )}

      {item.type === 'navigation' && <Ionicons name="chevron-forward" size={20} color="#C3B5E3" />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#FAFAF8', '#F5F0FF']} style={StyleSheet.absoluteFillObject} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Instellingen</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Beveiliging</Text>
          {privacySettings.map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Instellingen</Text>
          {appSettings.map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Beheer</Text>
          {dataSettings.map(renderSettingItem)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {accountSettings.map(renderSettingItem)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>InnerVoice v1.0.0</Text>
          <Text style={styles.footerText}>Met liefde gemaakt voor jouw innerlijke reis</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A4458',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B6478',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A4458',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B6478',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  version: {
    fontSize: 12,
    color: '#C3B5E3',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#6B6478',
    fontStyle: 'italic',
  },
});
