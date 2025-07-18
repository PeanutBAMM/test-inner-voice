import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useBackground } from '../../../contexts/BackgroundContext';
import { getMoodPalette } from '../../../constants/moodPalettes';

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  showVoiceButton?: boolean;
  onVoicePress?: () => void;
  onStartVoiceRecording?: () => void;
  onStopVoiceRecording?: () => void;
  isVoiceRecording?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = 'Type je bericht...',
  showVoiceButton = true,
  onVoicePress,
  onStartVoiceRecording,
  onStopVoiceRecording,
  isVoiceRecording = false,
}) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();
  const { currentMood, timeOfDay } = useBackground();
  const moodPalette = getMoodPalette(currentMood, theme.isDark);

  const heightAnim = useRef(new Animated.Value(44)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const voiceButtonScale = useRef(new Animated.Value(1)).current;

  // Voice recording pulse animation
  useEffect(() => {
    if (isVoiceRecording) {
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
      pulseAnim.stopAnimation();
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVoiceRecording, pulseAnim]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
      // Animate height back to default
      Animated.timing(heightAnim, {
        toValue: 44,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleVoicePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.sequence([
      Animated.timing(voiceButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(voiceButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (isVoiceRecording) {
      onStopVoiceRecording?.();
    } else {
      onStartVoiceRecording?.();
    }
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const baseHeight = 44;
    
    // Gebruik contentHeight direct
    const newHeight = Math.min(120, Math.max(baseHeight, height));

    Animated.timing(heightAnim, {
      toValue: newHeight,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Voice button BUITEN de input bubble */}
      {showVoiceButton && (
        <TouchableOpacity onPress={handleVoicePress} style={styles.voiceButton} activeOpacity={0.7}>
          <Animated.View
            style={[
              styles.voiceButtonContainer,
              {
                transform: [{ scale: voiceButtonScale }],
                backgroundColor: moodPalette.accent[1],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.voiceButtonPulse,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: isVoiceRecording ? 0.3 : 0,
                  backgroundColor: moodPalette.accent[0],
                },
              ]}
            />
            <Ionicons name={isVoiceRecording ? 'stop' : 'mic'} size={24} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* Input bubble met text input en send button BINNEN */}
      <Animated.View
        style={[
          styles.inputBubble,
          {
            backgroundColor: theme.isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
            },
          ]}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={
            theme.isDark ? 'rgba(255, 255, 255, 0.6)' : moodPalette.accent[1] + '80'
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSend}
          onContentSizeChange={handleContentSizeChange}
          returnKeyType="send"
          multiline
          numberOfLines={4}
          maxLength={500}
        />

        {/* Send button alleen zichtbaar als er text is */}
        {text.trim() && (
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} activeOpacity={0.7}>
            <Ionicons name="send" size={20} color={moodPalette.accent[1]} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 44,
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 4,
    gap: 8,
  },
  inputBubble: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 0,
    borderRadius: 22,
    borderWidth: 1,
    minHeight: 44,
    maxHeight: 120,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingVertical: 10,
    paddingRight: 8,
    lineHeight: 22,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  voiceButtonPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -10,
    left: -10,
  },
  sendButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    marginBottom: 0,
  },
});
