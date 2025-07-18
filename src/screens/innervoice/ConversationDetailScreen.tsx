import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UniversalBackground } from '../../components/backgrounds/UniversalBackground';
import { RootStackParamList } from '../../types/navigation';
import { TAB_BAR_HEIGHT } from '../../constants/navigation';

type ConversationDetailRouteProp = RouteProp<RootStackParamList, 'ConversationDetailScreen'>;

export default function ConversationDetailScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<ConversationDetailRouteProp>();
  const { conversationId, date } = route.params || {};

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
        },
      ]}
    >
      <UniversalBackground
        variant="gradient"
        mood="peaceful"
        timeOfDay="afternoon"
        enableEffects={false}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8B7BA7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gesprek Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={20} color="#8B7BA7" />
          <Text style={styles.dateText}>{date || 'Onbekende datum'}</Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Gesprek</Text>
          <Text style={styles.messageText}>
            Dit is een placeholder voor het gesprek. In de volledige versie worden hier de berichten
            van het gesprek weergegeven.
          </Text>
        </View>

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Inzichten</Text>
          <Text style={styles.insightsText}>
            Hier komen de belangrijkste inzichten uit dit gesprek.
          </Text>
        </View>
      </ScrollView>
    </View>
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8B7BA7',
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4458',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#6B627D',
    lineHeight: 20,
  },
  insightsContainer: {
    backgroundColor: 'rgba(232, 223, 253, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4458',
    marginBottom: 8,
  },
  insightsText: {
    fontSize: 14,
    color: '#6B627D',
    lineHeight: 20,
  },
});
