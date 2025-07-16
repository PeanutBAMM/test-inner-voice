import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SpiritualGradientBackground } from '../chat/backgrounds/SpiritualGradientBackground';
import { useTheme } from '../../contexts/ThemeContext';
import { useBackground, MoodType, TimeOfDay, BackgroundVariant } from '../../contexts/BackgroundContext';
import { getMoodPalette, getTimeTint } from '../../constants/moodPalettes';

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
            enableEnergyCore={false}
          >
            {children}
          </SpiritualGradientBackground>
        );

      case 'gradient': {
        const moodPalette = getMoodPalette(finalMood, theme.isDark);
        const timeTint = getTimeTint(finalTimeOfDay);
        
        return (
          <View style={[styles.container, style]}>
            {/* Base mood gradient */}
            <LinearGradient
              colors={moodPalette.primary as [string, string, ...string[]]}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Time of day tint overlay */}
            <View 
              style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: timeTint.tint }
              ]} 
            />
            
            {/* Content */}
            {children}
          </View>
        );
      }

      case 'minimal':
        return (
          <View style={[styles.container, style]}>
            {/* Simple theme-based gradient */}
            <LinearGradient
              colors={theme.isDark 
                ? ['#0F1419', '#1A2332'] 
                : [theme.colors.background, theme.colors.surface]
              }
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            
            {/* Content */}
            {children}
          </View>
        );

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
});