import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Message } from '../../types/chat';

interface Conversation {
  id: string;
  messages: Message[];
  startedAt: Date;
  lastMessageAt: Date;
  mood?: string;
  tags?: string[];
}

interface ConversationStore {
  currentConversation: Conversation | null;
  conversations: Conversation[];
  messages: Message[];
  isTyping: boolean;

  startNewConversation: () => void;
  addMessage: (message: Message) => void;
  setTyping: (isTyping: boolean) => void;
  saveConversation: () => Promise<void>;
  loadConversations: () => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  addToLibrary: (messageId: string, note?: string) => Promise<void>;
}

// Initial welcome message for new users
const getInitialMessages = (): Message[] => {
  return [
    {
      id: 'welcome',
      text: 'Welkom! Ik ben hier om je te helpen in je innerlijke reis. Waar wil je vandaag over praten?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ];
};

export const useConversationStore = create<ConversationStore>((set, get) => ({
  currentConversation: null,
  conversations: [],
  messages: getInitialMessages(),
  isTyping: false,

  startNewConversation: () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      messages: [],
      startedAt: new Date(),
      lastMessageAt: new Date(),
    };

    set({
      currentConversation: newConversation,
      messages: [],
    });
  },

  addMessage: (message) => {
    set((state) => {
      const updatedMessages = [...state.messages, message];

      if (state.currentConversation) {
        state.currentConversation.messages = updatedMessages;
        state.currentConversation.lastMessageAt = new Date();
      }

      return {
        messages: updatedMessages,
        currentConversation: state.currentConversation,
      };
    });
  },

  setTyping: (isTyping) => set({ isTyping }),

  saveConversation: async () => {
    const { currentConversation, conversations } = get();

    if (!currentConversation || currentConversation.messages.length === 0) {
      return;
    }

    try {
      // Get subscription tier to check limits
      const subscriptionData = await AsyncStorage.getItem('subscription');
      const subscription = subscriptionData ? JSON.parse(subscriptionData) : { tier: 'free' };
      const limit = subscription.tier === 'premium' ? 100 : 5;

      // Add current conversation to list
      let updatedConversations = [currentConversation, ...conversations];

      // Apply tier limits
      if (subscription.tier === 'free') {
        // Free: Keep only latest 5
        updatedConversations = updatedConversations.slice(0, limit);
      } else {
        // Premium: Remove older than 18 months
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - 18);

        updatedConversations = updatedConversations
          .filter((conv) => new Date(conv.startedAt) > cutoffDate)
          .slice(0, limit);
      }

      // Save to secure storage
      await SecureStore.setItemAsync('conversations', JSON.stringify(updatedConversations));

      set({ conversations: updatedConversations });
    } catch (error) {
      // Error saving conversation
    }
  },

  loadConversations: async () => {
    try {
      const stored = await SecureStore.getItemAsync('conversations');

      if (stored) {
        const conversations = JSON.parse(stored).map((conv: Conversation) => ({
          ...conv,
          startedAt: new Date(conv.startedAt),
          lastMessageAt: new Date(conv.lastMessageAt),
          messages: conv.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));

        set({ conversations });
      }
    } catch (error) {
      // Error loading conversations
    }
  },

  deleteConversation: async (id) => {
    const { conversations } = get();
    const updatedConversations = conversations.filter((conv) => conv.id !== id);

    try {
      await SecureStore.setItemAsync('conversations', JSON.stringify(updatedConversations));
      set({ conversations: updatedConversations });
    } catch (error) {
      // Error deleting conversation
    }
  },

  addToLibrary: async (messageId, note) => {
    const { currentConversation } = get();

    if (!currentConversation) return;

    const message = currentConversation.messages.find((m) => m.id === messageId);
    if (!message) return;

    try {
      const libraryData = await SecureStore.getItemAsync('personal_library');
      const library = libraryData ? JSON.parse(libraryData) : [];

      const libraryItem = {
        id: Date.now().toString(),
        text: message.text,
        conversationId: currentConversation.id,
        timestamp: new Date(),
        note,
      };

      library.unshift(libraryItem);

      await SecureStore.setItemAsync('personal_library', JSON.stringify(library));
    } catch (error) {
      // Error adding to library
    }
  },
}));
export default useConversationStore;
