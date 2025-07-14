import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();

  const sections = [
    {
      title: '1. Acceptatie van voorwaarden',
      content: 'Door InnerVoice te gebruiken, ga je akkoord met deze servicevoorwaarden. Als je niet akkoord gaat, gebruik de app dan niet.',
    },
    {
      title: '2. Gebruik van de dienst',
      content: 'InnerVoice is bedoeld voor persoonlijke reflectie en zelfontdekking. De app vervangt geen professionele medische of psychologische hulp.',
    },
    {
      title: '3. Gebruikersverantwoordelijkheden',
      content: 'Je bent verantwoordelijk voor het veilig bewaren van je inloggegevens en voor alle activiteiten onder je account.',
    },
    {
      title: '4. Intellectueel eigendom',
      content: 'Alle content, functies en functionaliteit van InnerVoice zijn eigendom van InnerVoice en worden beschermd door auteursrecht.',
    },
    {
      title: '5. Beperking van aansprakelijkheid',
      content: 'InnerVoice is niet aansprakelijk voor enige indirecte, incidentele of gevolgschade die voortvloeit uit het gebruik van de app.',
    },
    {
      title: '6. Wijzigingen',
      content: 'We behouden ons het recht voor om deze voorwaarden op elk moment te wijzigen. Belangrijke wijzigingen worden aan je gecommuniceerd.',
    },
  ];

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
        <Text style={styles.headerTitle}>Servicevoorwaarden</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introContainer}>
          <Text style={styles.introText}>
            Welkom bij InnerVoice. Deze servicevoorwaarden regelen je gebruik van onze app en diensten.
          </Text>
          <Text style={styles.lastUpdated}>Ingangsdatum: Januari 2025</Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.agreementSection}>
          <Ionicons name="information-circle-outline" size={20} color="#8B7BA7" />
          <Text style={styles.agreementText}>
            Door InnerVoice te gebruiken, bevestig je dat je deze voorwaarden hebt gelezen, begrepen en ermee akkoord gaat.
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Vragen?</Text>
          <Text style={styles.contactText}>
            Voor vragen over deze voorwaarden kun je contact met ons opnemen:
          </Text>
          <Text style={styles.contactEmail}>legal@innervoice.app</Text>
        </View>
      </ScrollView>
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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4458',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#6B627D',
    lineHeight: 20,
  },
  agreementSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(232, 223, 253, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  agreementText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#6B627D',
    lineHeight: 20,
  },
  contactSection: {
    backgroundColor: 'rgba(232, 223, 253, 0.2)',
    borderRadius: 12,
    padding: 16,
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