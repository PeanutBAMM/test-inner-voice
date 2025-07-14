import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useUserStore from '../../store/innervoice/useUserStore';
import useCoachStore from '../../store/innervoice/useCoachStore';
import useSubscriptionStore from '../../store/innervoice/useSubscriptionStore';

export default function ProfileScreen() {
  const { userProfile } = useUserStore();
  const { coachPersonality } = useCoachStore();
  const { tier, usage } = useSubscriptionStore();

  const stats = [
    { label: 'Gesprekken', value: usage.conversationCount },
    { label: 'Vragen vandaag', value: `${usage.questionsToday}${tier.type === 'free' ? '/3' : ''}` },
    { label: 'Dagen actief', value: '7' }, // Mock value
  ];

  const profileItems = [
    { label: 'Naam', value: userProfile?.userName || 'Niet ingesteld' },
    { label: 'Taal', value: userProfile?.preferredLanguage || 'Nederlands' },
    { label: 'Coach', value: coachPersonality.name },
    { label: 'Focus', value: userProfile?.currentFocus || 'Geen specifieke focus' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FAFAF8', '#F5F0FF']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#E8E3F5', '#FAFAF8']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>
                {userProfile?.userName?.charAt(0).toUpperCase() || '?'}
              </Text>
            </LinearGradient>
          </View>
          
          <Text style={styles.welcomeText}>Welkom terug,</Text>
          <Text style={styles.nameText}>{userProfile?.userName || 'Gebruiker'}</Text>
          
          <View style={styles.tierBadge}>
            <Ionicons 
              name={tier.type === 'premium' ? 'star' : 'star-outline'} 
              size={16} 
              color={tier.type === 'premium' ? '#FFD700' : '#C3B5E3'} 
            />
            <Text style={styles.tierText}>
              {tier.type === 'premium' ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profiel Details</Text>
          {profileItems.map((item, index) => (
            <View key={index} style={styles.profileItem}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jouw Reis</Text>
          <View style={styles.journeyCard}>
            <Text style={styles.journeyText}>
              Je bent begonnen met: &quot;{userProfile?.primaryIntention || 'Zelfontdekking'}&quot;
            </Text>
            <Text style={styles.journeySubtext}>
              Blijf trouw aan je pad en vier elke kleine stap voorwaarts.
            </Text>
          </View>
        </View>

        {tier.type === 'free' && (
          <TouchableOpacity style={styles.upgradeButton}>
            <LinearGradient
              colors={['#E8DFFD', '#C3B5E3']}
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
    </SafeAreaView>
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
    color: '#6B6478',
  },
  nameText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#4A4458',
    marginTop: 4,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
    color: '#4A4458',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 20,
    backgroundColor: 'white',
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
    color: '#8B7BA7',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B6478',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A4458',
    marginBottom: 12,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 223, 253, 0.3)',
  },
  itemLabel: {
    fontSize: 14,
    color: '#6B6478',
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A4458',
  },
  journeyCard: {
    backgroundColor: 'white',
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
    color: '#4A4458',
    lineHeight: 24,
  },
  journeySubtext: {
    fontSize: 14,
    color: '#6B6478',
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