export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface IAuthService {
  // Email/Password Auth
  signUp(email: string, password: string, metadata?: Record<string, any>): Promise<AuthSession>;
  signIn(email: string, password: string): Promise<AuthSession>;
  signOut(): Promise<void>;
  
  // Phone Auth
  signInWithPhone(phone: string): Promise<{ sessionId: string }>;
  verifyPhone(phone: string, code: string, sessionId: string): Promise<AuthSession>;
  
  // OAuth
  signInWithGoogle(): Promise<AuthSession>;
  signInWithApple(): Promise<AuthSession>;
  
  // Biometric Auth
  enableBiometric(): Promise<void>;
  signInWithBiometric(): Promise<AuthSession>;
  isBiometricEnabled(): Promise<boolean>;
  
  // Session Management
  getCurrentSession(): Promise<AuthSession | null>;
  refreshSession(): Promise<AuthSession>;
  
  // Password Reset
  resetPassword(email: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
  
  // User Management
  updateUser(updates: Partial<User>): Promise<User>;
  deleteUser(): Promise<void>;
}