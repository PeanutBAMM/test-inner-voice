import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { SpiritualGradientBackground } from '../chat/backgrounds/SpiritualGradientBackground';
import { useTheme } from '../../contexts/ThemeContext';
import { useBackground, MoodType, TimeOfDay, BackgroundVariant } from '../../contexts/BackgroundContext';
import { getMoodPalette, getTimeTint } from '../../constants/moodPalettes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UniversalBackgroundProps {
  variant?: BackgroundVariant;
  mood?: MoodType;
  timeOfDay?: TimeOfDay;
  enableEffects?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const UniversalBackground: React.FC<UniversalBackgroundProps> = ({
  variant,
  mood,
  timeOfDay,
  enableEffects = true,
  children,
  style,
}) => {
  const { theme } = useTheme();
  const { currentMood, timeOfDay: contextTimeOfDay, backgroundVariant } = useBackground();

  // Use props or fall back to context values
  const finalMood = mood || currentMood;
  const finalTimeOfDay = timeOfDay || contextTimeOfDay;
  const finalVariant = variant || backgroundVariant;

  const renderBackground = () => {
    switch (finalVariant) {
      case 'spiritual':
        return (
          <SpiritualGradientBackground
            mood={finalMood}
            timeOfDay={finalTimeOfDay}
            enableOrganicShapes={enableEffects}
          >
            {children}
          </SpiritualGradientBackground>
        );

      case 'gradient': {
        const moodPalette = getMoodPalette(finalMood, theme.isDark);
        const timeTint = getTimeTint(finalTimeOfDay);
        
        // Apply time-based brightness adjustment to colors
        const adjustColor = (color: string): string => {
          if (timeTint.brightness === 1.0) return color;
          
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

        const primaryColors = moodPalette.primary.map(adjustColor) as [string, string, ...string[]];
        const accentColors = moodPalette.accent.map(adjustColor) as [string, string, ...string[]];
        
        return (
          <View style={[styles.container, style]}>
            {/* Layer 1: Base gradient layer */}
            <LinearGradient
              colors={primaryColors}
              locations={[0, 0.17, 0.33, 0.5, 0.67, 0.83, 1].slice(0, primaryColors.length) as [number, number, ...number[]]}
              style={styles.baseGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            {/* Layer 2: Secondary gradient layer for depth */}
            <LinearGradient
              colors={[accentColors[0], accentColors[1], 'transparent']}
              style={styles.accentGradient}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
            />

            {/* Layer 3: Background halos for depth */}
            <View style={styles.shapesContainer}>
              <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFillObject}>
                <Circle 
                  cx={SCREEN_WIDTH * 0.7} 
                  cy={SCREEN_HEIGHT * 0.2} 
                  r={120} 
                  fill={adjustColor(moodPalette.glow)} 
                  opacity={0.1} 
                />
                <Circle 
                  cx={SCREEN_WIDTH * 0.3} 
                  cy={SCREEN_HEIGHT * 0.7} 
                  r={100} 
                  fill={adjustColor(moodPalette.glow)} 
                  opacity={0.08} 
                />
              </Svg>
            </View>
            
            {/* Layer 4: Time of day tint overlay */}
            <View 
              style={[
                styles.tintOverlay,
                { backgroundColor: timeTint.tint }
              ]} 
            />

            {/* Layer 5: Grain texture overlay */}
            <View style={styles.grainOverlay}>
              <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFillObject}>
                <Defs>
                  <Pattern id="grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                    <Circle cx="1" cy="1" r="0.5" fill={theme.isDark ? 'rgba(0,191,255,0.05)' : 'rgba(255,215,0,0.05)'} />
                    <Circle cx="3" cy="0" r="0.3" fill="rgba(255,255,255,0.08)" />
                    <Circle cx="0" cy="3" r="0.4" fill="rgba(255,255,255,0.06)" />
                    <Circle cx="2" cy="2" r="0.3" fill="rgba(255,255,255,0.1)" />
                    <Circle cx="3" cy="3" r="0.5" fill="rgba(255,255,255,0.05)" />
                  </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grain)" opacity={0.3} />
              </Svg>
            </View>

            {/* Layer 6: Vignette effect for focus */}
            <View style={styles.vignette} />
            
            {/* Content */}
            {children}
          </View>
        );
      }

      case 'minimal': {
        const moodPalette = getMoodPalette(finalMood, theme.isDark);
        const timeTint = getTimeTint(finalTimeOfDay);
        
        // Use fewer colors for performance
        const minimalColors = [
          moodPalette.primary[0],
          moodPalette.primary[2],
          moodPalette.primary[4]
        ] as [string, string, string];
        
        return (
          <View style={[styles.container, style]}>
            {/* Layer 1: Simplified gradient */}
            <LinearGradient
              colors={minimalColors}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />

            {/* Layer 2: Light accent overlay */}
            <LinearGradient
              colors={[moodPalette.accent[0], 'transparent']}
              style={[styles.accentGradient, { opacity: 0.3 }]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            
            {/* Layer 3: Time tint (lighter) */}
            <View 
              style={[
                styles.tintOverlay,
                { backgroundColor: timeTint.tint, opacity: 0.5 }
              ]} 
            />
            
            {/* Content */}
            {children}
          </View>
        );
      }

      default:
        return (
          <View style={[styles.container, style]}>
            {children}
          </View>
        );
    }
  };

  return renderBackground();
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
  tintOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  shapesContainer: {
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
});