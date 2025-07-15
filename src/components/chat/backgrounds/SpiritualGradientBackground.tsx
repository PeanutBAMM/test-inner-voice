import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';
import { EnergyCore } from './EnergyCore';
import { useTheme } from '../../../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Animated components removed for performance optimization

interface SpiritualGradientBackgroundProps {
  mood?: 'peaceful' | 'contemplative' | 'joyful' | 'grounded' | 'neutral';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  enableOrganicShapes?: boolean;
  enableEnergyCore?: boolean;
  children?: React.ReactNode;
  onMessageSent?: boolean;
}

// Mood-based color palettes - Dynamische paletten voor light/dark mode
export const MOOD_PALETTES = {
  peaceful: {
    primary: ['#FFF0F5', '#FFE4E1', '#FFD6E8', '#FFC8DD', '#FFB6C1', '#FFDAB9'], // Lavender blush naar perzik
    accent: ['#FFB6C1', '#FFA07A', '#FF7F50'], // Roze naar koraal accenten
    glow: '#FFB6C1', // Zachte roze gloed
    sparkle: '#FFD700', // Gouden sparkle
    orb1: '#FF69B4', // Hot pink voor diepte
    orb2: '#FFDAB9', // Perzik voor contrast
  },
  contemplative: {
    primary: ['#F8F0F8', '#F5E6F5', '#F2DCF2', '#EFD2EF', '#ECC8EC', '#E9BEE9'], // Koele roze-lila
    accent: ['#DDA0DD', '#DA70D6', '#D8BFD8'], // Plum naar thistle
    glow: '#DDA0DD', // Plum gloed
    sparkle: '#E6E6FA', // Lavender sparkle
    orb1: '#DA70D6', // Orchid
    orb2: '#FFE4E1', // Misty rose
  },
  joyful: {
    primary: ['#FFF5EE', '#FFEFD5', '#FFE4B5', '#FFDAB9', '#FFD39B', '#FFCBA4'], // Seashell naar perzik
    accent: ['#FFA07A', '#FF7F50', '#FF6347'], // Zalm naar tomaat
    glow: '#FFA07A', // Zalm gloed
    sparkle: '#FFD700', // Gouden sparkle
    orb1: '#FF7F50', // Koraal
    orb2: '#FFE4B5', // Moccasin
  },
  grounded: {
    primary: ['#F5E6E6', '#F0DADA', '#EBCECE', '#E6C2C2', '#E1B6B6', '#DCAAAA'], // Aardse roze
    accent: ['#CD5C5C', '#BC8F8F', '#F4A460'], // Indian red naar sandy brown
    glow: '#BC8F8F', // Rosy brown gloed
    sparkle: '#D2691E', // Chocolate sparkle
    orb1: '#CD5C5C', // Indian red
    orb2: '#FFE4E1', // Misty rose
  },
  neutral: {
    primary: ['#FFF0F5', '#F5E6EA', '#EBDCE0', '#E1D2D6', '#D7C8CC', '#CDBEC2'], // Lavender blush naar grijs-roze
    accent: ['#E6E6FA', '#D8BFD8', '#DDA0DD'], // Lavender naar plum
    glow: '#E6E6FA', // Lavender gloed
    sparkle: '#C0C0C0', // Zilveren sparkle
    orb1: '#D8BFD8', // Thistle
    orb2: '#FFE4E1', // Misty rose
  },
};

// Dark mode masculine energy palettes
export const DARK_MOOD_PALETTES = {
  peaceful: {
    primary: ['#0F1419', '#1A2332', '#2E5984', '#4A7BA7', '#7FB3D3', '#B3D9FF'], // Deep ocean progression
    accent: ['#2E5984', '#4A7BA7', '#7FB3D3'], // Steel blue spectrum
    glow: '#00CED1', // Dark turquoise glow
    sparkle: '#00BFFF', // Deep sky blue sparkle
    orb1: '#1A3A5C', // Dark navy
    orb2: '#00CED1', // Turquoise accent
  },
  contemplative: {
    primary: ['#1A1625', '#2D2A3D', '#4A3D5C', '#6B5B73', '#8B7BA7', '#B8A9C9'], // Deep purple progression
    accent: ['#663399', '#8A2BE2', '#9370DB'], // Purple spectrum
    glow: '#8A2BE2', // Blue violet glow
    sparkle: '#9370DB', // Medium slate blue sparkle
    orb1: '#4A3D5C', // Dark purple
    orb2: '#8A2BE2', // Blue violet accent
  },
  joyful: {
    primary: ['#0F1F1C', '#1A332E', '#2E5984', '#20B2AA', '#40E0D0', '#7FFFD4'], // Teal progression
    accent: ['#00CED1', '#20B2AA', '#40E0D0'], // Turquoise spectrum
    glow: '#00FFFF', // Cyan glow
    sparkle: '#7FFFD4', // Aquamarine sparkle
    orb1: '#1A332E', // Dark sea green
    orb2: '#00CED1', // Dark turquoise accent
  },
  grounded: {
    primary: ['#191F25', '#2A3F5F', '#4682B4', '#5F9EA0', '#708090', '#B0C4DE'], // Steel blue progression
    accent: ['#4682B4', '#5F9EA0', '#708090'], // Steel spectrum
    glow: '#4682B4', // Steel blue glow
    sparkle: '#B0C4DE', // Light steel blue sparkle
    orb1: '#2A3F5F', // Dark steel
    orb2: '#5F9EA0', // Cadet blue accent
  },
  neutral: {
    primary: ['#0F1419', '#2A3F5F', '#5F9EA0', '#778899', '#A9A9A9', '#D3D3D3'], // Balanced navy progression
    accent: ['#708090', '#778899', '#A9A9A9'], // Slate spectrum
    glow: '#5F9EA0', // Cadet blue glow
    sparkle: '#D3D3D3', // Light gray sparkle
    orb1: '#2A3F5F', // Dark blue-gray
    orb2: '#778899', // Light slate gray accent
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
  const { isDark } = useTheme();
  const palette = isDark ? DARK_MOOD_PALETTES[mood] : MOOD_PALETTES[mood];
  const timeTint = TIME_TINTS[timeOfDay];
  
  // Animation values removed for performance optimization
  
  // Animations removed for performance optimization
  
  // Pulse animation removed for performance optimization
  
  // Interpolated values removed for performance optimization

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

            {/* Background halos for depth - alleen 2 voor sfeer */}
            <Circle
              cx={SCREEN_WIDTH * 0.7}
              cy={SCREEN_HEIGHT * 0.2}
              r={120}
              fill={palette.glow}
              opacity={0.1}
            />
            <Circle
              cx={SCREEN_WIDTH * 0.3}
              cy={SCREEN_HEIGHT * 0.7}
              r={100}
              fill={palette.glow}
              opacity={0.08}
            />

            {/* Sparkles removed for performance optimization */}
          </Svg>
        </View>
      )}

      {/* Floating orbs removed for performance optimization */}

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

      {/* Zand grain texture overlay */}
      <View style={styles.grainOverlay} />

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
    overflow: 'visible',
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
  grainOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    // Subtiele grain texture effect
    opacity: 0.08,
    // CSS-like noise pattern simulatie
    shadowColor: 'rgba(139, 123, 167, 0.5)',
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowRadius: 0.5,
    shadowOpacity: 0.3,
    elevation: 1,
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
    shadowRadius: 20,
    shadowOpacity: 0.1,
    elevation: 8,
    opacity: 0.25, // Meer zichtbaar
  },
});