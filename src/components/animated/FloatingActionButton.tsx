import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface FABAction {
  icon: keyof typeof Ionicons.glyphMap;
  label?: string;
  onPress: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
  style?: ViewStyle;
  mainIcon?: keyof typeof Ionicons.glyphMap;
  mainColor?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Sub-component for individual action buttons to fix hooks issue
interface ActionButtonProps {
  action: FABAction;
  index: number;
  animation: SharedValue<number>;
}

function ActionButton({ action, index, animation }: ActionButtonProps) {
  const actionStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animation.value,
      [0, 1],
      [0, -(index + 1) * 70],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      animation.value,
      [0, 0.5, 1],
      [0, 0, 1],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      animation.value,
      [0, 1],
      [0.5, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale },
      ],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.actionButton, actionStyle]}>
      <TouchableOpacity
        style={[styles.actionButtonInner, { backgroundColor: action.color || theme.colors.secondary }]}
        onPress={action.onPress}
      >
        <Ionicons name={action.icon} size={24} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function FloatingActionButton({
  actions,
  style,
  mainIcon = 'add',
  mainColor = theme.colors.primary,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);
  const rotation = useSharedValue(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    animation.value = withSpring(isOpen ? 0 : 1, {
      damping: 15,
      stiffness: 150,
    });
    rotation.value = withSpring(isOpen ? 0 : 1);
  };

  const mainButtonStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animation.value,
      [0, 1],
      [1, 1.1],
      Extrapolate.CLAMP
    );
    const rotate = interpolate(
      rotation.value,
      [0, 1],
      [0, 45],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(animation.value * 0.5),
      pointerEvents: isOpen ? 'auto' : 'none',
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View 
        style={[StyleSheet.absoluteFillObject, styles.backdrop, backdropStyle]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFillObject} 
          onPress={toggleMenu}
          activeOpacity={1}
        />
      </Animated.View>

      {actions.map((action, index) => (
        <ActionButton
          key={index}
          action={{
            ...action,
            onPress: () => {
              action.onPress();
              toggleMenu();
            }
          }}
          index={index}
          animation={animation}
        />
      ))}

      <AnimatedTouchable
        style={[styles.mainButton]}
        onPress={toggleMenu}
        activeOpacity={0.8}
      >
        <Animated.View 
          style={[
            styles.mainButtonInner,
            { backgroundColor: mainColor },
            mainButtonStyle,
          ]}
        >
          <Ionicons
            name={mainIcon}
            size={28}
            color={theme.colors.white}
          />
        </Animated.View>
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    alignItems: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mainButton: {
    zIndex: 10,
  },
  mainButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButton: {
    position: 'absolute',
    zIndex: 5,
  },
  actionButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});