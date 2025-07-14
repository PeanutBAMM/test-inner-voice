import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface SparkleButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  sparkleCount?: number;
  sparkleColor?: string;
}

interface SparkleProps {
  index: number;
  color: string;
}

const Sparkle = ({ index, color }: SparkleProps) => {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 200;
    
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withSpring(1, { damping: 5 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      )
    );

    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, {
          duration: 2000,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0, { duration: 700 })
        ),
        -1,
        false
      )
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scale.value,
      [0, 1],
      [0, (index % 2 === 0 ? 1 : -1) * 30]
    );
    const translateY = interpolate(
      scale.value,
      [0, 1],
      [0, -30]
    );

    return {
      transform: [
        { translateX },
        { translateY },
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.sparkle, animatedStyle]}>
      <Ionicons name="star" size={16} color={color} />
    </Animated.View>
  );
};

const withDelay = (delay: number, animation: any) => {
  'worklet';
  return withSequence(
    withTiming(0, { duration: delay }),
    animation
  );
};

export function SparkleButton({
  title,
  onPress,
  style,
  sparkleCount = 3,
  sparkleColor = theme.colors.warning,
}: SparkleButtonProps) {
  const scale = useSharedValue(1);
  const sparkles = Array.from({ length: sparkleCount }, (_, i) => i);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
  };

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.container, style, buttonStyle]}>
        <View style={styles.sparkleContainer}>
          {sparkles.map((index) => (
            <Sparkle key={index} index={index} color={sparkleColor} />
          ))}
        </View>
        
        <Text style={styles.title}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    position: 'relative',
    overflow: 'visible',
    elevation: 6,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
});