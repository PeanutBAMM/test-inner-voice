import React, { forwardRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

export const MessageList = forwardRef<ScrollView, MessageListProps>(
  ({ messages, isTyping }, ref) => {
    return (
      <ScrollView
        ref={ref}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}
        
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
  },
  typingContainer: {
    marginLeft: 16,
    marginTop: 8,
  },
});