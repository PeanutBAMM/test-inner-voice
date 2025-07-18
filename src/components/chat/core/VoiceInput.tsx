import React, { useRef, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VoiceInputProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isRecording) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animation
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    onStartRecording();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    onStopRecording();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: pulseAnim }],
            opacity: isRecording ? 0.3 : 0,
          },
        ]}
      />

      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.button,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: isRecording ? '#FFE6D7' : '#E8DFFD',
            },
          ]}
        >
          <Ionicons name="mic" size={32} color={isRecording ? '#FF6B6B' : '#8B7BA7'} />
        </Animated.View>
      </TouchableOpacity>

      {isRecording && <Text style={styles.recordingText}>Aan het luisteren...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pulseCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8DFFD',
  },
  recordingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#C3B5E3',
  },
});
