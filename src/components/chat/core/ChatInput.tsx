import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useBackground } from '../../../contexts/BackgroundContext';
import { getMoodPalette } from '../../../constants/moodPalettes';
import { LinearGradient } from 'expo-linear-gradient';

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
  placeholder = "Type je bericht...",
  showVoiceButton = true,
  onVoicePress,
  onStartVoiceRecording,
  onStopVoiceRecording,
  isVoiceRecording = false,
}) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const { theme } = useTheme();
  const { currentMood, timeOfDay } = useBackground();
  const moodPalette = getMoodPalette(currentMood, theme.isDark);
  
  const glowAnim = useRef(new Animated.Value(0)).current;
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
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
      setInputHeight(40); // Reset height after sending
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
    const newHeight = Math.max(40, Math.min(120, height + 20));
    setInputHeight(newHeight);
  };

  const animatedShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  const animatedShadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          shadowOpacity: animatedShadowOpacity,
          shadowRadius: animatedShadowRadius,
          shadowColor: moodPalette.glow,
          elevation: isFocused ? 8 : 4,
        },
      ]}
    >
      <LinearGradient
        colors={
          theme.isDark 
            ? ['rgba(30, 30, 30, 0.95)', 'rgba(20, 20, 20, 0.95)']
            : ['rgba(255, 251, 247, 0.98)', 'rgba(255, 248, 243, 0.98)']
        }
        style={[
          styles.gradientContainer,
          {
            borderColor: moodPalette.accent[0] + '20', // 20% opacity accent
          }
        ]}
      >
        <View style={styles.inputWrapper}>
          {showVoiceButton && (
            <TouchableOpacity
              onPress={handleVoicePress}
              style={styles.voiceButton}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.voiceButtonContainer,
                  {
                    transform: [{ scale: voiceButtonScale }],
                    backgroundColor: isVoiceRecording 
                      ? moodPalette.accent[0] 
                      : theme.isDark 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(139, 123, 167, 0.1)',
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
                <Ionicons 
                  name={isVoiceRecording ? "stop" : "mic"} 
                  size={20} 
                  color={
                    isVoiceRecording 
                      ? '#FFFFFF' 
                      : theme.isDark 
                        ? moodPalette.sparkle 
                        : moodPalette.accent[0]
                  } 
                />
              </Animated.View>
            </TouchableOpacity>
          )}

          <TextInput
            style={[
              styles.input,
              { 
                height: inputHeight,
                color: theme.colors.text,
                borderRadius: 22,
                backgroundColor: theme.isDark 
                  ? 'rgba(0, 0, 0, 0.3)' 
                  : 'rgba(255, 255, 255, 0.95)',
                textAlign: 'left',
              },
            ]}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor={
              theme.isDark 
                ? 'rgba(255, 255, 255, 0.6)' 
                : moodPalette.accent[1] + '80'
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSend}
            onContentSizeChange={handleContentSizeChange}
            returnKeyType="send"
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              {
                backgroundColor: text.trim() 
                  ? moodPalette.accent[0] 
                  : theme.isDark 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(139, 123, 167, 0.1)',
                shadowColor: moodPalette.glow,
              },
              !text.trim() && styles.sendButtonDisabled
            ]}
            disabled={!text.trim()}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={
                text.trim() 
                  ? '#FFFFFF'
                  : theme.isDark 
                    ? moodPalette.sparkle 
                    : moodPalette.accent[1]
              } 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    borderRadius: 28,
    shadowColor: '#C3B5E3', // This will be overridden dynamically
    shadowOffset: {
      width: 0,
      height: 2,
    },
    overflow: 'hidden',
  },
  gradientContainer: {
    borderRadius: 28,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    lineHeight: 20,
    textAlignVertical: 'center',
  },
  voiceButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
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
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B7BA7',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
});