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
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

// Onboarding emblems: soft rings in the app's pink/peach palette
const OnboardingEmblem = ({ variant, isDark }: { variant: string; isDark: boolean }) => {
  const a = isDark ? '#4A7BA7' : '#FF69B4';
  const b = isDark ? '#00CED1' : '#FFB08A';
  const ring = isDark ? '#4A7BA7' : '#FFB6C1';
  return (
    <Svg width={150} height={150} viewBox="0 0 150 150">
      <Defs>
        <SvgGradient id="emb" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={a} />
          <Stop offset="1" stopColor={b} />
        </SvgGradient>
      </Defs>
      <Circle cx="75" cy="75" r="70" stroke={ring} strokeOpacity={0.35} strokeWidth={2} fill="none" />
      <Circle cx="75" cy="75" r="56" stroke={ring} strokeOpacity={0.55} strokeWidth={2} fill="none" />
      <Circle cx="75" cy="75" r="42" fill="url(#emb)" opacity={0.95} />
      {variant === '1' && (
        // sound wave: the inner voice
        <Path
          d="M51 75 L57 75 M61 68 L61 82 M67 60 L67 90 M73 66 L73 84 M79 56 L79 94 M85 64 L85 86 M91 70 L91 80 M97 75 L99 75"
          stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" fill="none"
        />
      )}
      {variant === '2' && (
        // listening inward: ripples around a still point
        <>
          <Circle cx="75" cy="75" r="6" fill="#FFFFFF" />
          <Circle cx="75" cy="75" r="15" stroke="#FFFFFF" strokeWidth={3} strokeOpacity={0.85} fill="none" />
          <Circle cx="75" cy="75" r="25" stroke="#FFFFFF" strokeWidth={3} strokeOpacity={0.55} fill="none" />
        </>
      )}
      {variant === '3' && (
        // growth: a sprout
        <>
          <Path d="M75 98 L75 70" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" fill="none" />
          <Path d="M75 76 C75 62 64 56 54 58 C54 70 62 78 75 76 Z" fill="#FFFFFF" />
          <Path d="M75 70 C75 56 86 50 96 52 C96 64 88 72 75 70 Z" fill="#FFFFFF" fillOpacity={0.85} />
        </>
      )}
    </Svg>
  );
};

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
            <OnboardingEmblem variant={item.id} isDark={theme.isDark} />
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
