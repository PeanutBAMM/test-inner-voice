import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useUserStore from '../../store/innervoice/useUserStore';
import useSubscriptionStore from '../../store/innervoice/useSubscriptionStore';
import { UniversalBackground } from '../../components/backgrounds/UniversalBackground';
import { useTheme } from '../../contexts/ThemeContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile } = useUserStore();
  const { tier, usage } = useSubscriptionStore();
  const { theme } = useTheme();

  const stats = [
    { label: 'Gesprekken', value: usage.conversationCount },
    { label: 'Vragen vandaag', value: `${usage.questionsToday}${tier.type === 'free' ? '/3' : ''}` },
    { label: 'Dagen actief', value: '7' }, // Mock value
  ];

  const profileItems = [
    { label: 'Naam', value: userProfile?.userName || 'Niet ingesteld' },
    { label: 'Taal', value: userProfile?.preferredLanguage || 'Nederlands' },
    { label: 'Focus', value: userProfile?.currentFocus || 'Geen specifieke focus' },
  ];

  return (
    <UniversalBackground 
      variant="gradient" 
      mood="contemplative" 
      timeOfDay="afternoon"
      enableEffects={false}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={theme.isDark 
                ? ['#4A3D5C', '#6B5B73'] 
                : ['#E8E3F5', '#FAFAF8']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>
                {userProfile?.userName?.charAt(0).toUpperCase() || '?'}
              </Text>
            </LinearGradient>
          </View>
          
          <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>Welkom terug,</Text>
          <Text style={[styles.nameText, { color: theme.colors.text }]}>{userProfile?.userName || 'Gebruiker'}</Text>
          
          <View style={[styles.tierBadge, { backgroundColor: theme.colors.card }]}>
            <Ionicons 
              name={tier.type === 'premium' ? 'star' : 'star-outline'} 
              size={16} 
              color={tier.type === 'premium' ? '#FFD700' : '#C3B5E3'} 
            />
            <Text style={[styles.tierText, { color: theme.colors.text }]}>
              {tier.type === 'premium' ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.colors.card }]}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Profiel Details</Text>
          {profileItems.map((item, index) => (
            <View key={index} style={[styles.profileItem, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.itemLabel, { color: theme.colors.textSecondary }]}>{item.label}</Text>
              <Text style={[styles.itemValue, { color: theme.colors.text }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Jouw Reis</Text>
          <View style={[styles.journeyCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.journeyText, { color: theme.colors.text }]}>
              Je bent begonnen met: &quot;{userProfile?.primaryIntention || 'Zelfontdekking'}&quot;
            </Text>
            <Text style={[styles.journeySubtext, { color: theme.colors.textSecondary }]}>
              Blijf trouw aan je pad en vier elke kleine stap voorwaarts.
            </Text>
          </View>
        </View>

        {tier.type === 'free' && (
          <TouchableOpacity style={styles.upgradeButton}>
            <LinearGradient
              colors={theme.isDark 
                ? ['#4A3D5C', '#6B5B73'] 
                : ['#E8DFFD', '#C3B5E3']}
              style={styles.upgradeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="star" size={20} color="white" />
              <Text style={styles.upgradeText}>Upgrade naar Premium</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
      </View>
    </UniversalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 20,
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '600',
    color: 'white',
  },
  welcomeText: {
    fontSize: 16,
  },
  nameText: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 4,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tierText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 20,
    backgroundColor: 'transparent',
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  itemLabel: {
    fontSize: 14,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  journeyCard: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  journeyText: {
    fontSize: 16,
    lineHeight: 24,
  },
  journeySubtext: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  upgradeButton: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
    borderRadius: 24,
    overflow: 'hidden',
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});