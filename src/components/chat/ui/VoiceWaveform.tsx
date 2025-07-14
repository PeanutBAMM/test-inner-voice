import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface VoiceWaveformProps {
  isActive?: boolean;
  color?: string;
  bars?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive = false,
  color = '#4ADE80',
  bars = 5,
}) => {
  const animatedValues = useRef(
    Array.from({ length: bars }, () => new Animated.Value(0.1))
  ).current;

  useEffect(() => {
    if (isActive) {
      const animations = animatedValues.map((value, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1,
              duration: 300 + index * 100,
              useNativeDriver: false,
            }),
            Animated.timing(value, {
              toValue: 0.1,
              duration: 300 + index * 100,
              useNativeDriver: false,
            }),
          ]),
          { iterations: -1 }
        )
      );

      Animated.stagger(50, animations).start();
    } else {
      animatedValues.forEach(value => {
        value.setValue(0.1);
      });
    }
  }, [isActive, animatedValues]);

  return (
    <View style={styles.container}>
      {animatedValues.map((animatedValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              transform: [
                {
                  scaleY: animatedValue,
                },
              ],
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    gap: 2,
  },
  bar: {
    width: 3,
    height: 40,
    borderRadius: 1.5,
  },
});