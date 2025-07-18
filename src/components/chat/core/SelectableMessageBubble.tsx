import React, { useState, useRef } from 'react';
import { Text, StyleSheet, Animated, TouchableOpacity, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../../types/chat';
import { useTheme } from '../../../contexts/ThemeContext';
import { useBackground } from '../../../contexts/BackgroundContext';
import { getMoodPalette } from '../../../constants/moodPalettes';

interface SelectableMessageBubbleProps {
  message: Message;
  onSaveToLibrary?: (text: string, type: 'sentence' | 'paragraph') => void;
}

export const SelectableMessageBubble: React.FC<SelectableMessageBubbleProps> = ({
  message,
  onSaveToLibrary,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isSelected, setIsSelected] = useState(false);
  const { theme } = useTheme();
  const { currentMood } = useBackground();
  const moodPalette = getMoodPalette(currentMood, theme.isDark);

  React.useEffect(() => {
    const animation = Animated.parallel([
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
    ]);

    animation.start();

    // Cleanup animation on unmount
    return () => {
      animation.stop();
      fadeAnim.removeAllListeners();
      slideAnim.removeAllListeners();
    };
  }, [fadeAnim, slideAnim]);

  const handleLongPress = () => {
    // Animate scale on long press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsSelected(true);
  };

  const handleSaveToLibrary = () => {
    try {
      if (onSaveToLibrary) {
        // Sla het hele bericht op
        onSaveToLibrary(message.text, 'paragraph');
      }
      setIsSelected(false);
    } catch (error) {
      console.warn('Error saving to library:', error);
      setIsSelected(false);
    }
  };

  const isUser = message.sender === 'user';

  // Assistant messages zonder bubble
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
        <TouchableOpacity
          onLongPress={handleLongPress}
          delayLongPress={500}
          activeOpacity={0.8}
          style={styles.assistantTouchable}
        >
          <Text style={[styles.text, styles.assistantText]}>{message.text}</Text>
        </TouchableOpacity>

        {/* Save Button voor assistant messages */}
        {isSelected && (
          <Animated.View
            style={[
              styles.saveButtonContainerAssistant,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.saveButton, {
                backgroundColor: moodPalette.accent[1],
                shadowColor: moodPalette.accent[1],
              }]}
              onPress={handleSaveToLibrary}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
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
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.bubble,
            styles.userBubble,
            isSelected && styles.selectedBubble,
            {
              backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
              shadowColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#000',
              shadowOpacity: theme.isDark ? 0.3 : 0.1,
            },
          ]}
          onLongPress={handleLongPress}
          delayLongPress={500}
          activeOpacity={0.8}
        >
          <Text style={[styles.text, styles.userText]} selectable={Platform.OS === 'ios'}>
            {message.text}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Save Button */}
      {isSelected && (
        <Animated.View
          style={[
            styles.saveButtonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: Animated.multiply(slideAnim, -1) }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.saveButton, {
              backgroundColor: moodPalette.accent[1],
              shadowColor: moodPalette.accent[1],
            }]}
            onPress={handleSaveToLibrary}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      )}
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
  },
  userBubble: {
    borderBottomRightRadius: 4,
    // Schaduw aan rechterkant voor user messages
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  assistantBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 253, 0.3)',
    // Schaduw aan linkerkant voor assistant messages
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedBubble: {
    backgroundColor: 'rgba(255, 182, 193, 0.2)',
    borderColor: '#FFB6C1',
    borderWidth: 2,
  },
  text: {
    fontSize: 17,
    lineHeight: 26,
  },
  userText: {
    color: '#4A4458',
    fontFamily: 'Inter_400Regular',
  },
  assistantText: {
    color: '#2C2C2E',
    fontFamily: 'Inter_400Regular',
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  assistantTouchable: {
    maxWidth: '100%',
  },
  saveButtonContainerAssistant: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  saveButtonContainer: {
    marginTop: 8,
  },
  saveButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB6C1',
    borderRadius: 22,
    elevation: 4,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bubbleTail: {
    position: 'absolute',
    right: -8,
    bottom: 0,
  },
});
