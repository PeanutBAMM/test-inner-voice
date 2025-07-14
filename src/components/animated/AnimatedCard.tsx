import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  delay?: number;
}

export function AnimatedCard({ children, style, onPress, delay = 0 }: AnimatedCardProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const pressed = useSharedValue(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 100,
      });
      opacity.value = withTiming(1, { duration: 500 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => {
    const pressedScale = interpolate(pressed.value, [0, 1], [1, 0.95]);
    
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value * pressedScale },
        {
          rotateZ: `${interpolate(
            scale.value,
            [0, 0.5, 1],
            [10, -5, 0]
          )}deg`,
        },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(pressed.value, [0, 1], [0.15, 0.05]),
      elevation: interpolate(pressed.value, [0, 1], [8, 2]),
    };
  });

  const handlePressIn = () => {
    pressed.value = withTiming(1, { duration: 100 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0);
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          style,
          animatedStyle,
          shadowStyle,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
});