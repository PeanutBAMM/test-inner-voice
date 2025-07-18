import React, { forwardRef, useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageBubble } from './MessageBubble';
import { SelectableMessageBubbleWrapper } from './SelectableMessageBubbleWrapper';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../../../types/chat';
import { useTheme } from '../../../contexts/ThemeContext';

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
  onSaveToLibrary?: (text: string, type: 'sentence' | 'paragraph') => void;
  useSelectableMessages?: boolean;
}

export const MessageList = forwardRef<ScrollView, MessageListProps>(
  ({ messages, isTyping, onSaveToLibrary, useSelectableMessages = false }, ref) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const [showBlur, setShowBlur] = useState(false);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setShowBlur(offsetY > 10);
    };

    return (
      <View style={styles.container}>
        <ScrollView
          ref={ref}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={true}
          alwaysBounceVertical={true}
          overScrollMode="always"
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {messages.map((message, index) => {
            const isFirstMessage = index === 0;
            const messageStyle = isFirstMessage ? { ...styles.firstMessage, marginTop: 8 } : {};

            if (useSelectableMessages) {
              return (
                <View key={message.id} style={messageStyle}>
                  <SelectableMessageBubbleWrapper
                    message={message}
                    onSaveToLibrary={onSaveToLibrary}
                  />
                </View>
              );
            }
            return (
              <View key={message.id} style={messageStyle}>
                <MessageBubble message={message} />
              </View>
            );
          })}

          {isTyping && (
            <View style={styles.typingContainer}>
              <TypingIndicator />
            </View>
          )}
        </ScrollView>

        {/* Blur gradient overlay aan de top - alleen tonen bij scroll */}
        {showBlur && (
          <LinearGradient
            colors={
              theme.isDark
                ? ['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.7)', 'transparent']
                : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.8)', 'transparent']
            }
            style={styles.blurOverlay}
            pointerEvents="none"
          />
        )}
      </View>
    );
  }
);

MessageList.displayName = 'MessageList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 10,
    flexGrow: 1,
  },
  typingContainer: {
    marginLeft: 16,
    marginTop: 8,
  },
  firstMessage: {
    // Dynamic spacing will be applied inline based on safe area
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    zIndex: 10,
  },
});
