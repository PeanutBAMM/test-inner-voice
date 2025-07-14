import { IAuthService, User, AuthSession } from '../../interfaces/IAuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class MockAuthService implements IAuthService {
  private currentUser: User | null = null;
  
  async signUp(email: string, password: string, metadata?: Record<string, any>): Promise<AuthSession> {
    // Mock signup
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: metadata?.name || email.split('@')[0],
    };
    
    const session: AuthSession = {
      user,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
    
    this.currentUser = user;
    await AsyncStorage.setItem('mock-auth-session', JSON.stringify(session));
    
    return session;
  }
  
  async signIn(email: string, password: string): Promise<AuthSession> {
    // Mock signin - accept test credentials
    if (email === 'test@example.com' && password === 'Niquegek$11') {
      const user: User = {
        id: 'test-user-id',
        email,
        name: 'Test User',
      };
      
      const session: AuthSession = {
        user,
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      };
      
      this.currentUser = user;
      await AsyncStorage.setItem('mock-auth-session', JSON.stringify(session));
      
      return session;
    }
    
    throw new Error('Invalid credentials');
  }
  
  async signOut(): Promise<void> {
    this.currentUser = null;
    await AsyncStorage.removeItem('mock-auth-session');
  }
  
  async signInWithPhone(phone: string): Promise<{ sessionId: string }> {
    // Mock phone auth
    return { sessionId: 'mock-session-' + Date.now() };
  }
  
  async verifyPhone(phone: string, code: string, sessionId: string): Promise<AuthSession> {
    // Mock verification - accept 123456 as valid code
    if (code === '123456') {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: `${phone}@phone.auth`,
        phone,
        name: 'Phone User',
      };
      
      const session: AuthSession = {
        user,
        accessToken: 'mock-access-token-' + Date.now(),
      };
      
      this.currentUser = user;
      await AsyncStorage.setItem('mock-auth-session', JSON.stringify(session));
      
      return session;
    }
    
    throw new Error('Invalid verification code');
  }
  
  async signInWithGoogle(): Promise<AuthSession> {
    // Mock Google auth
    const user: User = {
      id: 'google-user-id',
      email: 'user@gmail.com',
      name: 'Google User',
    };
    
    const session: AuthSession = {
      user,
      accessToken: 'mock-google-token-' + Date.now(),
    };
    
    this.currentUser = user;
    await AsyncStorage.setItem('mock-auth-session', JSON.stringify(session));
    
    return session;
  }
  
  async signInWithApple(): Promise<AuthSession> {
    // Mock Apple auth
    const user: User = {
      id: 'apple-user-id',
      email: 'user@icloud.com',
      name: 'Apple User',
    };
    
    const session: AuthSession = {
      user,
      accessToken: 'mock-apple-token-' + Date.now(),
    };
    
    this.currentUser = user;
    await AsyncStorage.setItem('mock-auth-session', JSON.stringify(session));
    
    return session;
  }
  
  async enableBiometric(): Promise<void> {
    await AsyncStorage.setItem('biometric-enabled', 'true');
  }
  
  async signInWithBiometric(): Promise<AuthSession> {
    const sessionStr = await AsyncStorage.getItem('mock-auth-session');
    if (sessionStr) {
      return JSON.parse(sessionStr);
    }
    throw new Error('No saved session for biometric auth');
  }
  
  async isBiometricEnabled(): Promise<boolean> {
    const enabled = await AsyncStorage.getItem('biometric-enabled');
    return enabled === 'true';
  }
  
  async getCurrentSession(): Promise<AuthSession | null> {
    const sessionStr = await AsyncStorage.getItem('mock-auth-session');
    if (sessionStr) {
      return JSON.parse(sessionStr);
    }
    return null;
  }
  
  async refreshSession(): Promise<AuthSession> {
    const session = await this.getCurrentSession();
    if (!session) {
      throw new Error('No session to refresh');
    }
    
    // Mock refresh
    session.accessToken = 'mock-refreshed-token-' + Date.now();
    await AsyncStorage.setItem('mock-auth-session', JSON.stringify(session));
    
    return session;
  }
  
  async resetPassword(email: string): Promise<void> {
    console.log('Password reset email sent to:', email);
  }
  
  async updatePassword(newPassword: string): Promise<void> {
    console.log('Password updated');
  }
  
  async updateUser(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }
    
    this.currentUser = { ...this.currentUser, ...updates };
    
    const session = await this.getCurrentSession();
    if (session) {
      session.user = this.currentUser;
      await AsyncStorage.setItem('mock-auth-session', JSON.stringify(session));
    }
    
    return this.currentUser;
  }
  
  async deleteUser(): Promise<void> {
    await this.signOut();
  }
}