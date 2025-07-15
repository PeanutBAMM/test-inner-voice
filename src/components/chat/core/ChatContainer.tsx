import React, { useRef, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Message } from '../../../types/chat';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  background?: React.ReactNode;
  inputComponent?: React.ComponentType<any>;
  isTyping?: boolean;
  placeholder?: string;
  onSaveToLibrary?: (text: string, type: 'sentence' | 'paragraph') => void;
  useSelectableMessages?: boolean;
  style?: any;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  background,
  inputComponent: InputComponent = ChatInput,
  isTyping = false,
  placeholder = "Type je bericht...",
  onSaveToLibrary,
  useSelectableMessages = false,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages.length]);

  return (
    <View style={[styles.container, style]}>
      {/* Background layer */}
      {background && (
        <View style={StyleSheet.absoluteFillObject}>
          {background}
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={[styles.content, { paddingBottom: insets.bottom }]}>
          <MessageList
            ref={scrollViewRef}
            messages={messages}
            isTyping={isTyping}
            onSaveToLibrary={onSaveToLibrary}
            useSelectableMessages={useSelectableMessages}
          />
          
          <InputComponent
            onSend={onSendMessage}
            placeholder={placeholder}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});