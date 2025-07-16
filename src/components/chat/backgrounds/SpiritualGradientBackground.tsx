import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle, Pattern, Rect } from 'react-native-svg';
import { useTheme } from '../../../contexts/ThemeContext';
import { getMoodPalette, getTimeTint, MoodPalette } from '../../../constants/moodPalettes';
import { MoodType, TimeOfDay } from '../../../contexts/BackgroundContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Animated components removed for performance optimization

interface SpiritualGradientBackgroundProps {
  mood?: MoodType;
  timeOfDay?: TimeOfDay;
  enableOrganicShapes?: boolean;
  children?: React.ReactNode;
}

// Mood palettes are now imported from centralized moodPalettes.ts

export const SpiritualGradientBackground: React.FC<SpiritualGradientBackgroundProps> = ({
  mood = 'peaceful',
  timeOfDay = 'afternoon',
  enableOrganicShapes = true,
  children,
}) => {
  const { isDark } = useTheme();
  const palette = getMoodPalette(mood, isDark);
  const timeTint = getTimeTint(timeOfDay);
  
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


      {/* Time of day tint overlay */}
      <View style={[styles.tintOverlay, { backgroundColor: timeTint.tint }]} />

      {/* Zand grain texture overlay met SVG pattern */}
      <View style={styles.grainOverlay}>
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <Pattern id="sandGrain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
              {/* Kleine dots voor grain effect */}
              <Circle cx="1" cy="1" r="0.5" fill="rgba(255, 255, 255, 0.1)" />
              <Circle cx="3" cy="0" r="0.3" fill="rgba(255, 255, 255, 0.08)" />
              <Circle cx="0" cy="3" r="0.4" fill="rgba(255, 255, 255, 0.06)" />
              <Circle cx="2" cy="2" r="0.3" fill="rgba(255, 255, 255, 0.1)" />
              <Circle cx="3" cy="3" r="0.5" fill="rgba(255, 255, 255, 0.05)" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#sandGrain)" opacity={0.3} />
        </Svg>
      </View>

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