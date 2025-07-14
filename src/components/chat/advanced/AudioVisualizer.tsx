import React from 'react';
import { View, StyleSheet } from 'react-native';

interface AudioVisualizerProps {
  audioLevels?: number[];
  isActive?: boolean;
  color?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioLevels = [0.3, 0.7, 0.5, 0.8, 0.4],
  isActive = false,
  color = '#4ADE80',
}) => {
  return (
    <View style={styles.container}>
      {audioLevels.map((level, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height: isActive ? level * 40 : 4,
              backgroundColor: color,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    gap: 2,
  },
  bar: {
    width: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 1.5,
    minHeight: 4,
  },
});