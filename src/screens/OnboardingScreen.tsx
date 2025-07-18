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
import { RootStackScreenProps } from '../types/navigation';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import useAppStore from '../store/useAppStore';
import { UniversalBackground } from '../components/backgrounds/UniversalBackground';

// type Props = RootStackScreenProps<'Onboarding'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  subtitle: string;
  image: unknown; // Replace with actual image imports
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welkom bij InnerVoice',
    subtitle: 'Ontdek de kracht van je innerlijke stem en begin je spirituele reis',
    image: null, // Add your image here
  },
  {
    id: '2',
    title: 'Ontdek je innerlijke wijsheid',
    subtitle: 'Leer luisteren naar je intuïtie en vind antwoorden binnen jezelf',
    image: null, // Add your image here
  },
  {
    id: '3',
    title: 'Begin je spirituele reis',
    subtitle: 'Mediteer, reflecteer en groei in een veilige en ondersteunende omgeving',
    image: null, // Add your image here
  },
];

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeAppOnboarding } = useAppStore();
  const { theme } = useTheme();

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

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

  const handleSkip = async () => {
    await handleComplete();
  };

  const handleComplete = async () => {
    try {
      await completeAppOnboarding();
      // Navigation happens automatically via RootNavigator when isAppOnboarded state changes
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.primary + '20' }]}>
            <Text style={styles.imagePlaceholderText}>🧘‍♀️</Text>
          </View>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {item.subtitle}
        </Text>
      </View>
    </View>
  );

  return (
    <UniversalBackground
      variant="modern"
      mood="peaceful"
      timeOfDay="afternoon"
      enableEffects={false}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <TouchableOpacity
          style={[
            styles.skipButton,
            {
              backgroundColor: theme.isDark
                ? 'rgba(46, 89, 132, 0.15)'
                : 'rgba(255, 182, 193, 0.15)',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 182, 193, 0.2)',
            },
          ]}
          onPress={handleSkip}
        >
          <Text style={[styles.skipText, { color: theme.colors.textSecondary }]}>Skip</Text>
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
                  { backgroundColor: theme.colors.border },
                  currentIndex === index && [
                    styles.paginationDotActive,
                    { backgroundColor: theme.colors.primary },
                  ],
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
    </UniversalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
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
    borderRadius: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.6,
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.6,
  },
  imagePlaceholderText: {
    fontSize: 100,
  },
  nextButton: {
    marginBottom: Spacing.md,
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  paginationDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  paginationDotActive: {
    width: 24,
  },
  skipButton: {
    padding: Spacing.sm,
    position: 'absolute',
    right: Spacing.lg,
    top: Spacing.xl,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    width: SCREEN_WIDTH,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
});
