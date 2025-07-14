import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassOverlayProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  children: React.ReactNode;
}

export const GlassOverlay: React.FC<GlassOverlayProps> = ({
  intensity = 20,
  tint = 'light',
  children,
}) => {
  // Create background opacity based on intensity (0-100 scale)
  const backgroundOpacity = Math.min(intensity / 100, 0.9);
  
  // Create background color based on tint
  const getBackgroundColor = () => {
    switch (tint) {
      case 'dark':
        return `rgba(0, 0, 0, ${backgroundOpacity})`;
      case 'light':
        return `rgba(255, 255, 255, ${backgroundOpacity})`;
      default:
        return `rgba(128, 128, 128, ${backgroundOpacity})`;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: getBackgroundColor() }
        ]}
      />
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});