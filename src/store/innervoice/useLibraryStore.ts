import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LibraryItem } from '../../types/chat';

interface LibraryState {
  items: LibraryItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadItems: () => Promise<void>;
  addItem: (item: Omit<LibraryItem, 'id' | 'timestamp'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<LibraryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearError: () => void;
  
  // Text selection specific
  saveTextSelection: (text: string, type: 'sentence' | 'paragraph', sourceMessageId?: string) => Promise<void>;
}

const STORAGE_KEY = 'personal_library';

export const useLibraryStore = create<LibraryState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored);
        set({ 
          items: items.map((item: LibraryItem) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })), 
          isLoading: false 
        });
      } else {
        set({ items: [], isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load library items',
        isLoading: false 
      });
    }
  },

  addItem: async (item) => {
    try {
      const newItem: LibraryItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };
      
      const currentItems = get().items;
      const updatedItems = [...currentItems, newItem];
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      set({ items: updatedItems, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add item to library' 
      });
    }
  },

  updateItem: async (id, updates) => {
    try {
      const currentItems = get().items;
      const updatedItems = currentItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      set({ items: updatedItems, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update item' 
      });
    }
  },

  deleteItem: async (id) => {
    try {
      const currentItems = get().items;
      const filteredItems = currentItems.filter(item => item.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
      set({ items: filteredItems, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete item' 
      });
    }
  },

  clearError: () => set({ error: null }),

  saveTextSelection: async (text, type, sourceMessageId) => {
    try {
      const newItem: LibraryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: text.trim(),
        timestamp: new Date(),
        type,
        sourceMessageId,
        category: type === 'sentence' ? 'Zinnen' : 'Alinea\'s',
      };
      
      const currentItems = get().items;
      const updatedItems = [...currentItems, newItem];
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      set({ items: updatedItems, error: null });
      
      // Optional: Show success feedback
      // console.log(`${type === 'sentence' ? 'Zin' : 'Alinea'} opgeslagen in bibliotheek`);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save text selection' 
      });
    }
  },
}));

export default useLibraryStore;