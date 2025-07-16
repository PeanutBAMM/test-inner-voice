import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../../types/chat';
import { useTheme } from '../../../contexts/ThemeContext';

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

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
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
            isUser ? styles.userBubble : styles.assistantBubble,
            isSelected && styles.selectedBubble,
            {
              shadowColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#000',
              shadowOpacity: theme.isDark ? 0.3 : 0.15,
            }
          ]}
          onLongPress={handleLongPress}
          delayLongPress={500}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.text, isUser ? styles.userText : styles.assistantText]}
            selectable={Platform.OS === 'ios'}
          >
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
            style={styles.saveButton}
            onPress={handleSaveToLibrary}
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark" size={24} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Opslaan in bibliotheek</Text>
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
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#E8DFFD',
    borderBottomRightRadius: 4,
    // Schaduw aan rechterkant voor user messages
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#4A4458',
  },
  assistantText: {
    color: '#6B6478',
  },
  saveButtonContainer: {
    marginTop: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB6C1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
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
});