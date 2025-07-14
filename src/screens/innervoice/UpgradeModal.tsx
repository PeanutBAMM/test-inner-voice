import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';

type UpgradeModalRouteProp = RouteProp<RootStackParamList, 'UpgradeModal'>;

export default function UpgradeModal() {
  const navigation = useNavigation();
  const route = useRoute<UpgradeModalRouteProp>();
  const { reason, resetTime } = route.params || {};

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#E8DFFD', '#C3B5E3']}
            style={styles.iconContainer}
          >
            <Ionicons name="star" size={48} color="white" />
          </LinearGradient>

          <Text style={styles.title}>Tijd voor Premium!</Text>
          
          {reason && <Text style={styles.reason}>{reason}</Text>}
          
          {resetTime && (
            <Text style={styles.resetTime}>
              Je kunt weer vragen stellen over {resetTime}
            </Text>
          )}

          <View style={styles.benefits}>
            <BenefitItem icon='infinite' text='Ongelimiteerde vragen' />
            <BenefitItem icon='mic' text='Coach praat terug' />
            <BenefitItem icon='cloud-upload' text='Veilige cloud backup' />
            <BenefitItem icon='time' text='18 maanden geschiedenis' />
          </View>

          <TouchableOpacity style={styles.upgradeButton}>
            <LinearGradient
              colors={['#8B7BA7', '#C3B5E3']}
              style={styles.buttonGradient}
            >
              <Text style={styles.upgradeText}>Upgrade voor €4,99/maand</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.laterButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.laterText}>Misschien later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const BenefitItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.benefitItem}>
    <Ionicons name={icon as any} size={20} color='#8B7BA7' />
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background instead of blur
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 20,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A4458',
    marginBottom: 12,
  },
  reason: {
    fontSize: 16,
    color: '#6B6478',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  resetTime: {
    fontSize: 14,
    color: '#C3B5E3',
    marginBottom: 24,
  },
  benefits: {
    width: '100%',
    marginVertical: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  benefitText: {
    fontSize: 16,
    color: '#4A4458',
    marginLeft: 12,
  },
  upgradeButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  upgradeText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  laterButton: {
    paddingVertical: 12,
  },
  laterText: {
    fontSize: 16,
    color: '#C3B5E3',
  },
});