import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../../../types/chat';

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
  const [selectedText, setSelectedText] = useState('');
  const [selectionType, setSelectionType] = useState<'sentence' | 'paragraph' | null>(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [selectionCoords, setSelectionCoords] = useState({ x: 0, y: 0 });
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

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

  // Get all sentences from text
  const getAllSentences = useCallback((text: string) => {
    // Verbeterde sentence detection met regex die ook zinnen zonder leestekens detecteert
    // Matches: "Zin met punt." of "Zin zonder punt aan het eind"
    const sentences = text.match(/[^.!?]+[.!?]+\s*|[^.!?\n]+$/g) || [text];
    
    // Clean up sentences
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
  }, []);

  // Get sentence at index
  const getSentenceAtIndex = useCallback((text: string, index: number) => {
    const sentences = getAllSentences(text);
    return sentences[index] || sentences[0] || text.trim();
  }, [getAllSentences]);

  // Paragraph boundary detection
  const getParagraphAtPosition = useCallback((text: string) => {
    const paragraphs = text.split(/\n\n+/);
    
    // Als er meerdere paragraphs zijn, neem de eerste
    if (paragraphs.length > 1) {
      return paragraphs[0].trim();
    }
    
    // Anders neem de hele text
    return text.trim();
  }, []);

  // Safe coordinate extraction
  const getSafeCoordinates = (event: any) => {
    // Check if event exists and has the expected properties
    if (!event || typeof event !== 'object') {
      return { x: 100, y: 100 }; // Safe default
    }
    
    // Gesture handler tap events have absoluteX and absoluteY
    const safeX = event.absoluteX ?? 100;
    const safeY = event.absoluteY ?? 100;
    
    // Ensure coordinates are within screen bounds
    const maxX = 300; // Fallback max width
    const maxY = 600; // Fallback max height
    
    return {
      x: Math.min(Math.max(safeX, 50), maxX),
      y: Math.min(Math.max(safeY, 50), maxY),
    };
  };

  // Single tap handler with error handling - cycles through sentences
  const singleTap = Gesture.Tap()
    .maxDuration(300)
    .onEnd((event) => {
      try {
        const sentences = getAllSentences(message.text);
        
        // Cycle through sentences
        const nextIndex = (currentSentenceIndex + 1) % sentences.length;
        setCurrentSentenceIndex(nextIndex);
        
        const selectedSentence = sentences[nextIndex];
        setSelectedText(selectedSentence);
        setSelectionType('sentence');
        setShowSaveButton(true);
        setSelectionCoords(getSafeCoordinates(event));
      } catch (error) {
        console.warn('Error in single tap handler:', error);
      }
    });

  // Double tap handler with error handling
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(300)
    .onEnd((event) => {
      try {
        const paragraph = getParagraphAtPosition(message.text);
        setSelectedText(paragraph);
        setSelectionType('paragraph');
        setShowSaveButton(true);
        setSelectionCoords(getSafeCoordinates(event));
      } catch (error) {
        console.warn('Error in double tap handler:', error);
      }
    });

  const combinedGesture = Gesture.Race(doubleTap, singleTap);

  const handleSaveToLibrary = () => {
    try {
      if (onSaveToLibrary && selectedText && selectionType) {
        onSaveToLibrary(selectedText, selectionType);
      }
      setShowSaveButton(false);
      setSelectedText('');
      setSelectionType(null);
    } catch (error) {
      console.warn('Error saving to library:', error);
      setShowSaveButton(false);
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
      <GestureDetector gesture={combinedGesture}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <Text
            style={[styles.text, isUser ? styles.userText : styles.assistantText]}
            selectable={Platform.OS === 'ios'}
          >
            {message.text}
          </Text>
        </View>
      </GestureDetector>

      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>

      {/* Save to Library Button */}
      {showSaveButton && (
        <Modal transparent={true} visible={showSaveButton}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSaveButton(false)}
          >
            <View
              style={[
                styles.saveButtonContainer,
                {
                  top: Math.max(selectionCoords.y - 60, 50),
                  left: Math.max(selectionCoords.x - 28, 20),
                },
              ]}
            >
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveToLibrary}
                activeOpacity={0.8}
              >
                <Ionicons name="bookmark-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>
                  {selectionType === 'sentence' ? `Zin ${currentSentenceIndex + 1}/${getAllSentences(message.text).length}` : 'Alinea'} opslaan
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
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
  },
  assistantBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 253, 0.3)',
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
  timestamp: {
    fontSize: 11,
    color: '#C3B5E3',
    marginTop: 4,
    marginHorizontal: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  saveButtonContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  saveButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 182, 193, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tooltip: {
    marginTop: 8,
    backgroundColor: 'rgba(74, 68, 88, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});