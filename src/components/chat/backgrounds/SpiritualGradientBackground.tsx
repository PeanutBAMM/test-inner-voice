import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';
import { EnergyCore } from './EnergyCore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Create animated SVG components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SpiritualGradientBackgroundProps {
  mood?: 'peaceful' | 'contemplative' | 'joyful' | 'grounded' | 'neutral';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  enableOrganicShapes?: boolean;
  enableEnergyCore?: boolean;
  children?: React.ReactNode;
  onMessageSent?: boolean;
}

// Mood-based color palettes - Zachte, fletse pastel gradients voor magisch effect
const MOOD_PALETTES = {
  peaceful: {
    primary: ['#FAF8F5', '#F8F6F3', '#F5F3F0', '#F3F1EE', '#F0EEEB', '#EDEAE8'], // Zacht beige/crème naar licht grijs
    accent: ['#F5F0E8', '#F0EBE3', '#EBE6DE'], // Warme neutrale accenten
    glow: '#F8E8D8', // Zachte warme gloed
    sparkle: '#F0D4A8', // Gouden sparkle voor zichtbaarheid
    orb1: '#E8D5C4', // Zacht terracotta voor orbs
    orb2: '#D4E4E8', // Zacht mint voor contrast
  },
  contemplative: {
    primary: ['#F3F0F5', '#F0EDF3', '#EDEAF0', '#EAE7ED', '#E7E4EA', '#E4E1E7'], // Zacht grijs-lavender
    accent: ['#E8E5F0', '#E5E2ED', '#E2DFEA'], // Koele accenten
    glow: '#E0DDE8', // Koele gloed
    sparkle: '#D4C8E0', // Lavender sparkle
    orb1: '#D8D0E8', // Zacht paars
    orb2: '#D0E8E0', // Zacht mint-grijs
  },
  joyful: {
    primary: ['#FBF8F3', '#F8F5F0', '#F5F2ED', '#F2EFEA', '#EFECE7', '#ECE9E4'], // Warm ivoor naar beige
    accent: ['#F8F0E8', '#F5EDE5', '#F2EAE2'], // Warme accenten
    glow: '#F5E8D8', // Warme gloed
    sparkle: '#F0D8B8', // Peachy sparkle
    orb1: '#F0DCC8', // Zacht peach
    orb2: '#D8E8D0', // Zacht groen
  },
  grounded: {
    primary: ['#F8F5F2', '#F5F2EF', '#F2EFEC', '#EFECE9', '#ECE9E6', '#E9E6E3'], // Neutrale aardetinten
    accent: ['#F0EDE8', '#EDE9E5', '#EAE6E2'], // Aardse accenten
    glow: '#E8E0D8', // Aardse gloed
    sparkle: '#E0D0C0', // Bruine sparkle
    orb1: '#E0D4C8', // Zacht bruin
    orb2: '#C8D8D0', // Zacht salie
  },
  neutral: {
    primary: ['#F5F5F5', '#F2F2F2', '#EFEFEF', '#ECECEC', '#E9E9E9', '#E6E6E6'], // Zachte grijzen
    accent: ['#F0F0F0', '#EDEDED', '#EAEAEA'], // Neutrale accenten
    glow: '#E8E8E8', // Neutrale gloed
    sparkle: '#D8D8D8', // Zilveren sparkle
    orb1: '#E0E0E0', // Licht grijs
    orb2: '#D0D8E0', // Blauw-grijs
  },
};

// Time of day tints
const TIME_TINTS = {
  morning: { tint: 'rgba(255, 248, 235, 0.05)', brightness: 1.05 },
  afternoon: { tint: 'rgba(255, 255, 255, 0)', brightness: 1.0 },
  evening: { tint: 'rgba(235, 225, 255, 0.08)', brightness: 0.95 },
  night: { tint: 'rgba(220, 210, 240, 0.1)', brightness: 0.9 },
};

export const SpiritualGradientBackground: React.FC<SpiritualGradientBackgroundProps> = ({
  mood = 'peaceful',
  timeOfDay = 'afternoon',
  enableOrganicShapes = true,
  enableEnergyCore = true,
  children,
  onMessageSent = false,
}) => {
  const palette = MOOD_PALETTES[mood];
  const timeTint = TIME_TINTS[timeOfDay];
  
  // Animation values for floating orbs
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0.5)).current; // Start at different phase
  const floatAnim3 = useRef(new Animated.Value(1)).current; // Start at different phase
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0.6)).current;
  
  // Continuous floating animations
  useEffect(() => {
    // Float animation for orbs
    const createFloatAnimation = (animValue: Animated.Value, delay: number = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
    };
    
    // Sparkle twinkling animation
    const sparkleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0.3,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    
    // Start all animations
    Animated.parallel([
      createFloatAnimation(floatAnim1),
      createFloatAnimation(floatAnim2, 1000),
      createFloatAnimation(floatAnim3, 2000),
      sparkleAnimation,
    ]).start();
  }, [floatAnim1, floatAnim2, floatAnim3, sparkleAnim]);
  
  // Pulse animation when message is sent
  useEffect(() => {
    if (onMessageSent) {
      pulseAnim.setValue(1);
      
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [onMessageSent, pulseAnim]);
  
  // Create interpolated values for floating
  const float1Y = floatAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });
  
  const float2Y = floatAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });
  
  const float3Y = floatAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -35],
  });

  // Apply time-based brightness adjustment to colors
  const adjustColor = (color: string): string => {
    if (timeTint.brightness === 1.0) return color;
    
    // Simple brightness adjustment
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const adjust = (value: number) => Math.min(255, Math.floor(value * timeTint.brightness));
    
    const newR = adjust(r).toString(16).padStart(2, '0');
    const newG = adjust(g).toString(16).padStart(2, '0');
    const newB = adjust(b).toString(16).padStart(2, '0');
    
    return `#${newR}${newG}${newB}`;
  };

  const primaryColors = palette.primary.map(adjustColor) as [string, string, ...string[]];
  const accentColors = palette.accent.map(adjustColor) as [string, string, ...string[]];

  return (
    <View style={styles.container}>
      {/* Base gradient layer */}
      <LinearGradient
        colors={primaryColors}
        locations={[0, 0.17, 0.33, 0.5, 0.67, 0.83, 1].slice(0, primaryColors.length) as [number, number, ...number[]]}
        style={styles.baseGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Secondary gradient layer for depth */}
      <LinearGradient
        colors={[accentColors[0], accentColors[1], 'transparent']}
        style={styles.accentGradient}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Magical Orbs and Sparkles layer */}
      {enableOrganicShapes && (
        <View style={styles.shapesContainer}>
          <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFillObject}>
            <Defs>
              {/* Gradient for glowing orbs */}
              <SvgLinearGradient id="orbGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={palette.glow} stopOpacity="0.6" />
                <Stop offset="50%" stopColor={palette.accent[0]} stopOpacity="0.3" />
                <Stop offset="100%" stopColor={palette.accent[1]} stopOpacity="0.1" />
              </SvgLinearGradient>
              
              {/* Radial gradient for center glow */}
              <SvgLinearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={palette.glow} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>

            {/* Background halos for depth */}
            <Circle
              cx={SCREEN_WIDTH * 0.7}
              cy={SCREEN_HEIGHT * 0.2}
              r={150}
              fill={palette.glow}
              opacity={0.15}
            />
            <Circle
              cx={SCREEN_WIDTH * 0.3}
              cy={SCREEN_HEIGHT * 0.6}
              r={120}
              fill={palette.glow}
              opacity={0.12}
            />

            {/* Floating glowing orbs - met zichtbare kleuren */}
            <Circle
              cx={SCREEN_WIDTH * 0.2}
              cy={SCREEN_HEIGHT * 0.3}
              r={40}
              fill={palette.orb1}
              opacity={0.25}
            />
            
            <Circle
              cx={SCREEN_WIDTH * 0.7}
              cy={SCREEN_HEIGHT * 0.4}
              r={55}
              fill={palette.orb2}
              opacity={0.2}
            />
            
            <Circle
              cx={SCREEN_WIDTH * 0.5}
              cy={SCREEN_HEIGHT * 0.25}
              r={35}
              fill={palette.orb1}
              opacity={0.3}
            />
            
            <Circle
              cx={SCREEN_WIDTH * 0.8}
              cy={SCREEN_HEIGHT * 0.6}
              r={30}
              fill={palette.orb2}
              opacity={0.25}
            />

            {/* Sparkles */}
            {[
              { x: SCREEN_WIDTH * 0.15, y: SCREEN_HEIGHT * 0.2 },
              { x: SCREEN_WIDTH * 0.85, y: SCREEN_HEIGHT * 0.3 },
              { x: SCREEN_WIDTH * 0.6, y: SCREEN_HEIGHT * 0.15 },
              { x: SCREEN_WIDTH * 0.3, y: SCREEN_HEIGHT * 0.5 },
              { x: SCREEN_WIDTH * 0.9, y: SCREEN_HEIGHT * 0.45 },
              { x: SCREEN_WIDTH * 0.4, y: SCREEN_HEIGHT * 0.35 },
            ].map((pos, index) => (
              <Path
                key={`sparkle-${index}`}
                d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z"
                fill={palette.sparkle}
                opacity={0.6}
                transform={`translate(${pos.x}, ${pos.y}) scale(1)`}
              />
            ))}
          </Svg>
        </View>
      )}

      {/* View-based animated orbs for better animation support */}
      {enableOrganicShapes && (
        <>
          <Animated.View
            style={[
              styles.floatingOrb,
              {
                left: SCREEN_WIDTH * 0.1,
                top: SCREEN_HEIGHT * 0.2,
                width: 60,
                height: 60,
                backgroundColor: palette.orb1,
                transform: [
                  { translateY: float1Y },
                  { scale: pulseAnim }
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.floatingOrb,
              {
                right: SCREEN_WIDTH * 0.15,
                top: SCREEN_HEIGHT * 0.35,
                width: 80,
                height: 80,
                backgroundColor: palette.orb2,
                transform: [
                  { translateY: float2Y },
                  { scale: pulseAnim }
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.floatingOrb,
              {
                left: SCREEN_WIDTH * 0.4,
                bottom: SCREEN_HEIGHT * 0.3,
                width: 50,
                height: 50,
                backgroundColor: palette.orb1,
                transform: [
                  { translateY: float3Y },
                  { scale: pulseAnim }
                ],
              },
            ]}
          />
        </>
      )}

      {/* Energy Core - Het kloppende hart van de app */}
      {enableEnergyCore && (
        <EnergyCore
          mood={mood}
          onPulse={onMessageSent}
          intensity={0.7}
        />
      )}

      {/* Time of day tint overlay */}
      <View style={[styles.tintOverlay, { backgroundColor: timeTint.tint }]} />

      {/* Subtle vignette for focus */}
      <View style={styles.vignette} />

      {/* Children content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  accentGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.6,
  },
  shapesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  tintOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  vignette: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    // Create vignette effect with shadow
    shadowColor: 'rgba(139, 123, 167, 0.08)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 100,
    shadowOpacity: 1,
    elevation: 10,
  },
  floatingOrb: {
    position: 'absolute',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    shadowOpacity: 0.08,
    elevation: 5,
    opacity: 0.15,
  },
});