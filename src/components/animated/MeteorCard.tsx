import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MeteorCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  meteorCount?: number;
  meteorColors?: string[];
}

interface MeteorProps {
  delay: number;
  duration: number;
  colors: string[];
}

const Meteor = ({ delay, duration, colors }: MeteorProps) => {
  const translateX = useSharedValue(-100);
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(SCREEN_WIDTH + 100, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(SCREEN_WIDTH + 100, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 200 }),
        -1,
        false
      )
    );
  }, [delay, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: '45deg' },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.meteor, animatedStyle]}>
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.meteorGradient}
      />
    </Animated.View>
  );
};

export function MeteorCard({
  children,
  style,
  meteorCount = 5,
  meteorColors = ['transparent', theme.colors.primary, 'transparent'],
}: MeteorCardProps) {
  const meteors = Array.from({ length: meteorCount }, (_, i) => ({
    id: i,
    delay: i * 1000,
    duration: 3000 + Math.random() * 2000,
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={styles.meteorContainer}>
        {meteors.map((meteor) => (
          <Meteor
            key={meteor.id}
            delay={meteor.delay}
            duration={meteor.duration}
            colors={meteorColors}
          />
        ))}
      </View>
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  meteorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  meteor: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 200,
    height: 2,
  },
  meteorGradient: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
});