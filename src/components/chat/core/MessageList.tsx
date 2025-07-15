import React, { forwardRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
    return (
      <GestureHandlerRootView style={styles.gestureContainer}>
        <ScrollView
          ref={ref}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => {
            const isFirstMessage = index === 0;
            const messageStyle = isFirstMessage ? styles.firstMessage : {};
            
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
      </GestureHandlerRootView>
    );
  }
);

MessageList.displayName = 'MessageList';

const styles = StyleSheet.create({
  gestureContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  typingContainer: {
    marginLeft: 16,
    marginTop: 8,
  },
  firstMessage: {
    marginTop: 40, // Extra spacing voor welkomst bericht onder buttons
  },
});