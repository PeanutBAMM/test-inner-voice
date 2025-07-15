export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatMessage extends Message {
  // Extended properties for chat messages
  isTyping?: boolean;
  metadata?: {
    conversationId?: string;
    model?: string;
    tokens?: number;
  };
}

export interface LibraryItem {
  id: string;
  text: string;
  conversationId?: string;
  timestamp: Date;
  category?: string;
  note?: string;
  type?: 'sentence' | 'paragraph' | 'manual';
  sourceMessageId?: string;
}

export type TextSelectionType = 'sentence' | 'paragraph';

export interface TextSelection {
  text: string;
  type: TextSelectionType;
  sourceMessageId?: string;
  coordinates?: {
    x: number;
    y: number;
  };
}