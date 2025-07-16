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
          elevation: isFocused ? 8 : 4,
        },
      ]}
    >
      <LinearGradient
        colors={
          theme.isDark 
            ? ['rgba(139, 123, 167, 0.1)', 'rgba(195, 181, 227, 0.05)']
            : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']
        }
        style={styles.gradientContainer}
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
                      ? theme.colors.accent 
                      : theme.isDark 
                        ? 'rgba(139, 123, 167, 0.2)' 
                        : 'rgba(195, 181, 227, 0.2)',
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.voiceButtonPulse,
                    {
                      transform: [{ scale: pulseAnim }],
                      opacity: isVoiceRecording ? 0.3 : 0,
                      backgroundColor: theme.colors.accent,
                    },
                  ]}
                />
                <Ionicons 
                  name={isVoiceRecording ? "stop" : "mic"} 
                  size={20} 
                  color={
                    isVoiceRecording 
                      ? theme.isDark ? '#FFFFFF' : '#000000'
                      : theme.colors.accent
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
                borderRadius: inputHeight / 2,
                backgroundColor: theme.isDark 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(139, 123, 167, 0.05)',
              },
            ]}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
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
                  ? theme.colors.accent 
                  : theme.isDark 
                    ? 'rgba(139, 123, 167, 0.2)' 
                    : 'rgba(195, 181, 227, 0.2)',
              },
              !text.trim() && styles.sendButtonDisabled
            ]}
            disabled={!text.trim()}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color={
                text.trim() 
                  ? theme.isDark ? '#FFFFFF' : '#000000'
                  : theme.colors.textSecondary
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
    shadowColor: '#C3B5E3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    overflow: 'hidden',
  },
  gradientContainer: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(195, 181, 227, 0.2)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    textAlignVertical: 'top',
  },
  voiceButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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