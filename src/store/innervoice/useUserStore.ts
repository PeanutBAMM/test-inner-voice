import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  userName: string;
  preferredLanguage: 'Nederlands' | 'English';
  primaryIntention: string;
  emotionalStyle: string;
  spiritualExperience?: string;
  currentFocus?: string;
  allowNotifications: boolean;
  biometricEnabled: boolean;
  notificationPreference: string;
}

interface UserStore {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  
  loadUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  clearUserData: () => Promise<void>;
  setAuthenticated: (value: boolean) => void;
}

const defaultProfile: UserProfile = {
  userName: '',
  preferredLanguage: 'Nederlands',
  primaryIntention: '',
  emotionalStyle: '',
  allowNotifications: true,
  biometricEnabled: false,
  notificationPreference: 'Af en toe, niet te vaak',
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userProfile: null,
      isAuthenticated: false,

      loadUserProfile: (profile) => set({ 
        userProfile: profile,
        isAuthenticated: true 
      }),

      updateUserProfile: (updates) => set((state) => ({
        userProfile: state.userProfile 
          ? { ...state.userProfile, ...updates }
          : { ...defaultProfile, ...updates }
      })),

      clearUserData: async () => {
        // Clear all stored data
        await AsyncStorage.multiRemove([
          'user-store',
          'coach-store',
          'conversation-store',
          'subscription-store',
          'onboardingCompleted',
          'userProfile'
        ]);
        
        set({ 
          userProfile: null,
          isAuthenticated: false 
        });
      },

      setAuthenticated: (value) => set({ isAuthenticated: value }),
    }),
    {
      name: 'user-store',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
export default useUserStore;