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
  isAppOnboarded: boolean;
  appVersion: string;
  
  // Actions
  toggleTheme: () => void;
  setLanguage: (language: 'nl' | 'en') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  completeOnboarding: () => void;
  completeAppOnboarding: () => void;
  resetOnboarding: () => void;
  initializeFromStorage: () => Promise<void>;
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'light',
      language: 'nl',
      notificationsEnabled: true,
      isOnboarded: false,
      isAppOnboarded: false,
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
      
      completeAppOnboarding: () => {
        set({ isAppOnboarded: true });
        AsyncStorage.setItem('appOnboardingCompleted', 'true');
      },
      
      resetOnboarding: () => set({ isOnboarded: false, isAppOnboarded: false }),
      
      initializeFromStorage: async () => {
        try {
          const appOnboardingCompleted = await AsyncStorage.getItem('appOnboardingCompleted');
          const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
          
          set({
            isAppOnboarded: appOnboardingCompleted === 'true',
            isOnboarded: onboardingCompleted === 'true',
          });
        } catch (error) {
          console.error('Error initializing from storage:', error);
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAppStore;