import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

interface GlowingBorderProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  borderWidth?: number;
  glowIntensity?: number;
}

export function GlowingBorder({
  children,
  style,
  colors = [theme.colors.primary, theme.colors.secondary, theme.colors.primary],
  borderWidth = 2,
  glowIntensity = 0.8,
}: GlowingBorderProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.glowContainer, animatedStyle]}>
        <LinearGradient
          colors={colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.glow,
            {
              opacity: glowIntensity,
              borderRadius: style?.borderRadius || theme.borderRadius.lg,
            },
          ]}
        />
      </Animated.View>
      
      <View
        style={[
          styles.content,
          {
            margin: borderWidth,
            borderRadius: style?.borderRadius 
              ? (style.borderRadius as number) - borderWidth 
              : theme.borderRadius.lg - borderWidth,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: theme.borderRadius.lg,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glow: {
    flex: 1,
  },
  content: {
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
});