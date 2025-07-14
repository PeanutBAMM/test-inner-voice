import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IAuthService, User, AuthSession } from '@/services/interfaces/IAuthService';
import { authService } from '@/services';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: AuthSession | null;
  biometricEnabled: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<{ sessionId: string }>;
  verifyPhone: (phone: string, code: string, sessionId: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  enableBiometric: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      session: null,
      biometricEnabled: false,
      
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const session = await authService.signIn(email, password);
          
          set({
            isAuthenticated: true,
            user: session.user,
            session,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      loginWithPhone: async (phone: string) => {
        try {
          set({ isLoading: true });
          const result = await authService.signInWithPhone(phone);
          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      verifyPhone: async (phone: string, code: string, sessionId: string) => {
        try {
          set({ isLoading: true });
          const session = await authService.verifyPhone(phone, code, sessionId);
          
          set({
            isAuthenticated: true,
            user: session.user,
            session,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      loginWithGoogle: async () => {
        try {
          set({ isLoading: true });
          const session = await authService.signInWithGoogle();
          
          set({
            isAuthenticated: true,
            user: session.user,
            session,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      loginWithApple: async () => {
        try {
          set({ isLoading: true });
          const session = await authService.signInWithApple();
          
          set({
            isAuthenticated: true,
            user: session.user,
            session,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      loginWithBiometric: async () => {
        try {
          set({ isLoading: true });
          const session = await authService.signInWithBiometric();
          
          set({
            isAuthenticated: true,
            user: session.user,
            session,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      signup: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true });
          const session = await authService.signUp(email, password, { name });
          
          set({
            isAuthenticated: true,
            user: session.user,
            session,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        try {
          await authService.signOut();
          set({
            isAuthenticated: false,
            user: null,
            session: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear local state even if remote logout fails
          set({
            isAuthenticated: false,
            user: null,
            session: null,
          });
        }
      },
      
      updateUser: async (updates: Partial<User>) => {
        const updatedUser = await authService.updateUser(updates);
        set({ user: updatedUser });
        
        // Update session with new user data
        const currentSession = get().session;
        if (currentSession) {
          set({
            session: { ...currentSession, user: updatedUser }
          });
        }
      },
      
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const session = await authService.getCurrentSession();
          
          if (session) {
            const biometricEnabled = await authService.isBiometricEnabled();
            set({
              isAuthenticated: true,
              user: session.user,
              session,
              biometricEnabled,
              isLoading: false,
            });
          } else {
            set({ isLoading: false, isAuthenticated: false });
          }
        } catch {
          set({ isLoading: false, isAuthenticated: false });
        }
      },
      
      enableBiometric: async () => {
        await authService.enableBiometric();
        set({ biometricEnabled: true });
      },
      
      resetPassword: async (email: string) => {
        await authService.resetPassword(email);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        session: state.session,
        biometricEnabled: state.biometricEnabled,
      }),
    }
  )
);

export default useAuthStore;