import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Message } from '../../../types/chat';
import { useTheme } from '../../../contexts/ThemeContext';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const { theme } = useTheme();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isUser = message.sender === 'user';

  // Assistant messages zonder bubble, user messages met bubble
  if (!isUser) {
    return (
      <Animated.View
        style={[
          styles.container,
          styles.assistantContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.text, styles.assistantText]}>{message.text}</Text>
      </Animated.View>
    );
  }

  // User messages met bubble
  return (
    <Animated.View
      style={[
        styles.container,
        styles.userContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View
        style={[
          styles.bubble,
          styles.userBubble,
          {
            shadowColor: theme.isDark ? 'rgba(255, 255, 255, 0.05)' : '#8B7BA7',
            shadowOpacity: theme.isDark ? 0.1 : 0.08,
          },
        ]}
      >
        <Text style={[styles.text, styles.userText]}>{message.text}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
    paddingRight: 32,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userBubble: {
    backgroundColor: '#E8DFFD',
    borderBottomRightRadius: 4,
    // Moderne zachte schaduw
    shadowColor: '#8B7BA7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
  },
  userText: {
    color: '#4A4458',
  },
  assistantText: {
    color: '#6B6478',
  },
});
