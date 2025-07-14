import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  showVoiceButton?: boolean;
  onVoicePress?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = "Type je bericht...",
  showVoiceButton = false,
  onVoicePress,
}) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const glowAnim = useRef(new Animated.Value(0)).current;

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
    }
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
      <View style={styles.inputWrapper}>
        {showVoiceButton && (
          <TouchableOpacity
            onPress={onVoicePress}
            style={styles.voiceButton}
          >
            <Ionicons name="mic" size={24} color="#C3B5E3" />
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor="#C3B5E380"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
          disabled={!text.trim()}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={text.trim() ? "#8B7BA7" : "#C3B5E340"} 
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    shadowColor: '#C3B5E3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#4A4458',
    maxHeight: 100,
    minHeight: 24,
    paddingTop: Platform.OS === 'ios' ? 4 : 0,
    paddingBottom: Platform.OS === 'ios' ? 4 : 0,
  },
  voiceButton: {
    padding: 4,
    marginRight: 8,
  },
  sendButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});