import React, { useEffect } from 'react';
import {
  Text,
  TextProps,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';

interface AnimatedTextProps extends TextProps {
  children: string;
  animation?: 'typewriter' | 'fade' | 'slide' | 'bounce' | 'gradient';
  duration?: number;
  delay?: number;
}

const AnimatedTextComponent = Animated.createAnimatedComponent(Text);

export function AnimatedText({
  children,
  animation = 'fade',
  duration = 1000,
  delay = 0,
  style,
  ...props
}: AnimatedTextProps) {
  const opacity = useSharedValue(animation === 'fade' ? 0 : 1);
  const translateY = useSharedValue(animation === 'slide' ? 50 : 0);
  const scale = useSharedValue(animation === 'bounce' ? 0 : 1);
  const textLength = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      switch (animation) {
        case 'fade':
          opacity.value = withTiming(1, { duration });
          break;
        
        case 'slide':
          opacity.value = withTiming(1, { duration: duration / 2 });
          translateY.value = withSpring(0, {
            damping: 15,
            stiffness: 100,
          });
          break;
        
        case 'bounce':
          scale.value = withSequence(
            withSpring(1.2, { damping: 5 }),
            withSpring(1, { damping: 15 })
          );
          break;
        
        case 'typewriter':
          textLength.value = withTiming(children.length, {
            duration: duration,
            easing: Easing.linear,
          });
          break;
        
        case 'gradient':
          opacity.value = withRepeat(
            withSequence(
              withTiming(0.5, { duration: duration / 2 }),
              withTiming(1, { duration: duration / 2 })
            ),
            -1,
            true
          );
          break;
      }
    };

    if (delay > 0) {
      const timeout = setTimeout(startAnimation, delay);
      return () => clearTimeout(timeout);
    } else {
      startAnimation();
    }
  }, [animation, duration, delay, children.length]);

  const animatedProps = useAnimatedProps(() => {
    if (animation === 'typewriter') {
      return {
        text: children.slice(0, Math.floor(textLength.value)),
      } as any;
    }
    return {};
  });

  const animatedStyle = useAnimatedProps(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    } as any;
  });

  if (animation === 'typewriter') {
    return (
      <AnimatedTextComponent
        style={[styles.text, style]}
        animatedProps={animatedProps}
        {...props}
      />
    );
  }

  return (
    <AnimatedTextComponent
      style={[styles.text, style, animatedStyle]}
      {...props}
    >
      {children}
    </AnimatedTextComponent>
  );
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.text,
  },
});