import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: 'Gegevensverzameling',
      content: 'InnerVoice verzamelt alleen de gegevens die nodig zijn voor het functioneren van de app. Dit omvat je naam, taalvoorkeuren, en gespreksgeschiedenis.',
    },
    {
      title: 'Gegevensopslag',
      content: 'Al je persoonlijke gegevens worden veilig opgeslagen op je apparaat. Gesprekken worden lokaal bewaard en zijn alleen voor jou toegankelijk.',
    },
    {
      title: 'Gegevensbeveiliging',
      content: 'We gebruiken geavanceerde encryptie om je gegevens te beschermen. Optionele biometrische beveiliging biedt extra bescherming.',
    },
    {
      title: 'Delen van gegevens',
      content: 'Je gegevens worden nooit gedeeld met derden zonder je expliciete toestemming. Je privacy staat bij ons voorop.',
    },
    {
      title: 'Je rechten',
      content: 'Je hebt altijd het recht om je gegevens in te zien, te wijzigen of te verwijderen. Dit kan via de instellingen in de app.',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
        <Text style={styles.headerTitle}>Privacybeleid</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introContainer}>
          <Text style={styles.introText}>
            Bij InnerVoice nemen we je privacy zeer serieus. Dit beleid beschrijft hoe we omgaan met je persoonlijke gegevens.
          </Text>
          <Text style={styles.lastUpdated}>Laatst bijgewerkt: Januari 2025</Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons 
                name={index === 0 ? 'document-text' : index === 1 ? 'save' : index === 2 ? 'shield-checkmark' : index === 3 ? 'share-social' : 'person'}
                size={20} 
                color="#8B7BA7" 
              />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact</Text>
          <Text style={styles.contactText}>
            Heb je vragen over ons privacybeleid? Neem contact met ons op via:
          </Text>
          <Text style={styles.contactEmail}>privacy@innervoice.app</Text>
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
  introContainer: {
    marginBottom: 24,
  },
  introText: {
    fontSize: 16,
    color: '#4A4458',
    lineHeight: 24,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#8B7BA7',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4458',
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#6B627D',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: 'rgba(232, 223, 253, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4458',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6B627D',
    lineHeight: 20,
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: 14,
    color: '#8B7BA7',
    fontWeight: '500',
  },
});