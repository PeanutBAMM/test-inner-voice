import React, { forwardRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageBubble } from './MessageBubble';
import { SelectableMessageBubbleWrapper } from './SelectableMessageBubbleWrapper';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../../../types/chat';

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
  onSaveToLibrary?: (text: string, type: 'sentence' | 'paragraph') => void;
  useSelectableMessages?: boolean;
}

export const MessageList = forwardRef<ScrollView, MessageListProps>(
  ({ messages, isTyping, onSaveToLibrary, useSelectableMessages = false }, ref) => {
    const insets = useSafeAreaInsets();
    
    return (
      <ScrollView
          ref={ref}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          bounces={true}
          alwaysBounceVertical={true}
          overScrollMode="always"
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message, index) => {
            const isFirstMessage = index === 0;
            const messageStyle = isFirstMessage ? 
              { ...styles.firstMessage, marginTop: insets.top + 80 } : {};
            
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
                <MessageBubble
                  message={message}
                />
              </View>
            );
          })}
          
          {isTyping && (
            <View style={styles.typingContainer}>
              <TypingIndicator />
            </View>
          )}
        </ScrollView>
    );
  }
);

MessageList.displayName = 'MessageList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    flexGrow: 1,
    minHeight: '100%',
  },
  typingContainer: {
    marginLeft: 16,
    marginTop: 8,
  },
  firstMessage: {
    // Dynamic spacing will be applied inline based on safe area
  },
});