import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  // App settings
  theme: 'light' | 'dark';
  language: 'nl' | 'en';
  notificationsEnabled: boolean;
  
  // App state
  isOnboarded: boolean;
  appVersion: string;
  
  // Actions
  toggleTheme: () => void;
  setLanguage: (language: 'nl' | 'en') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'light',
      language: 'nl',
      notificationsEnabled: true,
      isOnboarded: false,
      appVersion: '1.0.0',
      
      // Actions
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      
      setLanguage: (language) => set({ language }),
      
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),
      
      completeOnboarding: () => set({ isOnboarded: true }),
      
      resetOnboarding: () => set({ isOnboarded: false }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAppStore;