import React from 'react';
import { SelectableMessageBubble } from './SelectableMessageBubble';
import { MessageBubble } from './MessageBubble';
import { Message } from '../../../types/chat';

interface SelectableMessageBubbleWrapperProps {
  message: Message;
  onSaveToLibrary?: (text: string, type: 'sentence' | 'paragraph') => void;
}

export const SelectableMessageBubbleWrapper: React.FC<SelectableMessageBubbleWrapperProps> = ({
  message,
  onSaveToLibrary,
}) => {
  try {
    return <SelectableMessageBubble message={message} onSaveToLibrary={onSaveToLibrary} />;
  } catch (error) {
    console.warn('SelectableMessageBubble crashed, falling back to MessageBubble:', error);
    // Fallback to normal MessageBubble if SelectableMessageBubble crashes
    return <MessageBubble message={message} />;
  }
};
