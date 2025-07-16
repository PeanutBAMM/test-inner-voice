import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUserStore from '../../store/innervoice/useUserStore';
import useSubscriptionStore from '../../store/innervoice/useSubscriptionStore';
import { useTheme } from '../../contexts/ThemeContext';
import mockAuthService from '../../services/auth/mockAuthService';
import { TAB_BAR_HEIGHT } from '../../constants/navigation';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userProfile } = useUserStore();
  const { tier, usage } = useSubscriptionStore();
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset scroll position when screen is focused
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const stats = [
    { label: 'Gesprekken', value: usage.conversationCount },
    { label: 'Vragen vandaag', value: `${usage.questionsToday}${tier.type === 'free' ? '/1000' : ''}` },
    { label: 'Dagen actief', value: '7' }, // Mock value
  ];

  const profileItems = [
    { label: 'Naam', value: userProfile?.userName || 'Niet ingesteld' },
    { label: 'Taal', value: userProfile?.preferredLanguage || 'Nederlands' },
    { label: 'Focus', value: userProfile?.currentFocus || 'Geen specifieke focus' },
  ];

  return (
    <View style={[styles.container, { 
      paddingTop: insets.top,
      paddingBottom: TAB_BAR_HEIGHT + insets.bottom 
    }]}>
      <LinearGradient
        colors={theme.isDark ? ['#0F1419', '#1A2332'] : [theme.colors.background, theme.colors.surface]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={theme.isDark ? ['#2E5984', '#0F1419'] : [theme.colors.peaceful.primary[2], theme.colors.peaceful.primary[0]]}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>
                {userProfile?.userName?.charAt(0).toUpperCase() || '?'}
              </Text>
            </LinearGradient>
          </View>
          
          <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>Welkom terug,</Text>
          <Text style={[styles.nameText, { color: theme.colors.text }]}>{userProfile?.userName || 'Gebruiker'}</Text>
          
          <View style={[styles.tierBadge, { 
            backgroundColor: theme.colors.card,
            shadowColor: theme.isDark ? theme.colors.primary : '#000',
            shadowOpacity: theme.isDark ? 0.2 : 0.05,
          }]}>
            <Ionicons 
              name={tier.type === 'premium' ? 'star' : 'star-outline'} 
              size={16} 
              color={tier.type === 'premium' ? '#FFD700' : theme.colors.textLight} 
            />
            <Text style={[styles.tierText, { color: theme.colors.text }]}>
              {tier.type === 'premium' ? 'Premium' : 'Free'}
            </Text>
          </View>
        </View>

        <View style={[styles.statsContainer, { 
          backgroundColor: theme.colors.card,
          shadowColor: theme.isDark ? theme.colors.primary : '#000',
          shadowOpacity: theme.isDark ? 0.2 : 0.05,
        }]}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.textSecondary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Profiel Details</Text>
          {profileItems.map((item, index) => (
            <View key={index} style={[styles.profileItem, { borderBottomColor: theme.colors.border + '4D' }]}>
              <Text style={[styles.itemLabel, { color: theme.colors.textSecondary }]}>{item.label}</Text>
              <Text style={[styles.itemValue, { color: theme.colors.text }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Jouw Reis</Text>
          <View style={[styles.journeyCard, { 
            backgroundColor: theme.colors.card,
            shadowColor: theme.isDark ? theme.colors.primary : '#000',
            shadowOpacity: theme.isDark ? 0.2 : 0.05,
          }]}>
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
              colors={[theme.colors.peaceful.primary[2], theme.colors.peaceful.accent[0]]}
              style={styles.upgradeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="star" size={20} color="white" />
              <Text style={styles.upgradeText}>Upgrade naar Premium</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={async () => {
            Alert.alert(
              'Uitloggen',
              'Weet je zeker dat je wilt uitloggen?',
              [
                { text: 'Annuleren', style: 'cancel' },
                { 
                  text: 'Uitloggen', 
                  style: 'destructive',
                  onPress: async () => {
                    // Clear auth status
                    await mockAuthService.logout();
                    // Clear user data
                    await AsyncStorage.multiRemove([
                      'userProfile',
                      'onboardingCompleted',
                      'conversation-store',
                      'subscription-store',
                      'user-store',
                      'coach-store'
                    ]);
                    // Navigation wordt automatisch afgehandeld door RootNavigator
                  }
                }
              ]
            );
          }}
        >
          <Text style={styles.logoutText}>Uitloggen</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    shadowOffset: { width: 0, height: 2 },
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
    borderRadius: 16,
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
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
  },
  itemLabel: {
    fontSize: 14,
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  journeyCard: {
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
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
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});