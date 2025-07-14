import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '@/constants/theme';

interface AuthIllustrationProps {
  size?: number;
}

export function AuthIllustration({ size = 200 }: AuthIllustrationProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={theme.colors.primaryLight} stopOpacity="0.6" />
          </LinearGradient>
        </Defs>
        
        {/* Background circle */}
        <Circle
          cx="100"
          cy="100"
          r="90"
          fill="url(#grad1)"
          opacity="0.1"
        />
        
        {/* Phone outline */}
        <G transform="translate(70, 40)">
          <Path
            d="M10 5 Q10 0 15 0 L45 0 Q50 0 50 5 L50 115 Q50 120 45 120 L15 120 Q10 120 10 115 Z"
            fill={theme.colors.white}
            stroke={theme.colors.primary}
            strokeWidth="2"
          />
          
          {/* Screen */}
          <Path
            d="M15 15 L45 15 L45 100 L15 100 Z"
            fill={theme.colors.surface}
          />
          
          {/* Lock icon */}
          <G transform="translate(20, 45)">
            <Circle
              cx="10"
              cy="15"
              r="8"
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="2"
            />
            <Path
              d="M5 15 L5 10 Q5 5 10 5 Q15 5 15 10 L15 15"
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="2"
            />
          </G>
          
          {/* Home button */}
          <Circle
            cx="30"
            cy="110"
            r="4"
            fill={theme.colors.border}
          />
        </G>
        
        {/* Decorative elements */}
        <Circle cx="40" cy="30" r="3" fill={theme.colors.primaryLight} opacity="0.6" />
        <Circle cx="160" cy="50" r="4" fill={theme.colors.primary} opacity="0.4" />
        <Circle cx="150" cy="150" r="3" fill={theme.colors.primaryLight} opacity="0.6" />
        <Circle cx="50" cy="160" r="5" fill={theme.colors.primary} opacity="0.3" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});