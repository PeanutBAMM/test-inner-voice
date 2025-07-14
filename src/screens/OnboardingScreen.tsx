import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenProps } from '@/types/navigation';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { theme } from '@/constants/theme';
import useAppStore from '@/store/useAppStore';

type Props = RootStackScreenProps<'Onboarding'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  subtitle: string;
  image: any; // Replace with actual image imports
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welkom bij Apex',
    subtitle: 'De beste manier om je app te bouwen met React Native en Expo',
    image: null, // Add your image here
  },
  {
    id: '2',
    title: 'Snel en Schaalbaar',
    subtitle: 'Gebouwd met performance in gedachten, klaar om mee te groeien',
    image: null, // Add your image here
  },
  {
    id: '3',
    title: 'Alles wat je nodig hebt',
    subtitle: 'Componenten, navigatie, state management - alles is al geregeld',
    image: null, // Add your image here
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding } = useAppStore();

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    await completeOnboarding();
    navigation.replace('Auth', { screen: 'Auth' });
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>🚀</Text>
          </View>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <PrimaryButton
          title={currentIndex === onboardingData.length - 1 ? 'Aan de slag' : 'Volgende'}
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  footer: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  image: {
    height: SCREEN_WIDTH * 0.8,
    width: SCREEN_WIDTH * 0.8,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '20',
    borderRadius: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.6,
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.6,
  },
  imagePlaceholderText: {
    fontSize: 100,
  },
  nextButton: {
    marginBottom: theme.spacing.md,
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  paginationDot: {
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  skipButton: {
    padding: theme.spacing.sm,
    position: 'absolute',
    right: theme.spacing.lg,
    top: theme.spacing.xl,
    zIndex: 1,
  },
  skipText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    width: SCREEN_WIDTH,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
});