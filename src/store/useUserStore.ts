import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
}

interface UserState {
  // User data
  user: UserProfile | null;
  isAuthenticated: boolean;
  userProfile: any; // For app-specific profile data (e.g., InnerVoice)
  
  // User preferences
  preferences: UserPreferences;
  
  // User data
  favoriteItems: string[];
  recentSearches: string[];
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setUserProfile: (profile: any) => void;
  loadUserProfile: (profile: any) => void;
  updateUserProfile: (updates: Partial<any>) => void;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addFavoriteItem: (itemId: string) => void;
  removeFavoriteItem: (itemId: string) => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      userProfile: null,
      preferences: {
        pushNotifications: true,
        emailNotifications: true,
        marketingEmails: false,
      },
      favoriteItems: [],
      recentSearches: [],
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      loadUserProfile: (profile) => set({ userProfile: profile }),
      
      updateUserProfile: (updates) => set((state) => ({
        userProfile: { ...state.userProfile, ...updates }
      })),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        userProfile: null,
        favoriteItems: [],
        recentSearches: []
      }),
      
      updatePreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),
      
      addFavoriteItem: (itemId) =>
        set((state) => ({
          favoriteItems: [...new Set([...state.favoriteItems, itemId])],
        })),
      
      removeFavoriteItem: (itemId) =>
        set((state) => ({
          favoriteItems: state.favoriteItems.filter((id) => id !== itemId),
        })),
      
      addRecentSearch: (search) =>
        set((state) => ({
          recentSearches: [
            search,
            ...state.recentSearches.filter((s) => s !== search),
          ].slice(0, 10), // Keep only last 10 searches
        })),
      
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;