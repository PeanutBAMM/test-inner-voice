import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SpeechRecognitionProps {
  isListening?: boolean;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({
  isListening = false,
  onResult,
  onError,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.status}>{isListening ? 'Listening...' : 'Ready to listen'}</Text>
      {/* TODO: Implement actual speech recognition using expo-speech */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    color: '#666',
  },
});
