import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'apple' | 'facebook' | 'email' | 'phone' | 'guest';
  role: 'user' | 'admin' | 'guest';
  createdAt: string;
}

// Mock user profiles for development
const MOCK_USERS: Record<string, MockUser> = {
  google: {
    id: 'google-test-user',
    name: 'Emma van der Berg',
    email: 'emma@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    provider: 'google',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  apple: {
    id: 'apple-admin-user',
    name: 'Sophie Willemsen',
    email: 'sophie@innervoice.app',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    provider: 'apple',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  facebook: {
    id: 'facebook-test-user',
    name: 'Lisa de Vries',
    email: 'lisa@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    provider: 'facebook',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  email: {
    id: 'email-test-user',
    name: 'Anna Janssen',
    email: 'anna@example.com',
    provider: 'email',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  phone: {
    id: 'phone-test-user',
    name: 'Mia Bakker',
    email: 'mia@example.com',
    provider: 'phone',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  guest: {
    id: 'guest-user',
    name: 'Guest User',
    email: 'guest@innervoice.app',
    provider: 'guest',
    role: 'guest',
    createdAt: new Date().toISOString(),
  },
};

export class MockAuthService {
  private static instance: MockAuthService;
  private currentUser: MockUser | null = null;

  static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  /**
   * Mock social login - always succeeds in development
   */
  async loginWithProvider(provider: 'google' | 'apple' | 'facebook' | 'email'): Promise<MockUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = MOCK_USERS[provider];
    this.currentUser = user;

    // Store in AsyncStorage for persistence
    await AsyncStorage.setItem('mockUser', JSON.stringify(user));
    await AsyncStorage.setItem('isAuthenticated', 'true');

    if (__DEV__) {
      console.log(`🔐 Mock login successful for ${provider}:`, user);
    }

    return user;
  }

  /**
   * Mock phone login - accepts any phone number
   */
  async loginWithPhone(phoneNumber: string): Promise<{ requiresOTP: boolean; user?: MockUser }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // In development, we'll skip OTP and login directly
    const user = {
      ...MOCK_USERS.phone,
      id: `phone-${phoneNumber.replace(/\D/g, '')}`,
      name: `User ${phoneNumber.slice(-4)}`,
      email: `user${phoneNumber.slice(-4)}@example.com`,
    };

    this.currentUser = user;

    // Store in AsyncStorage for persistence
    await AsyncStorage.setItem('mockUser', JSON.stringify(user));
    await AsyncStorage.setItem('isAuthenticated', 'true');

    if (__DEV__) {
      console.log(`📱 Mock phone login successful for ${phoneNumber}:`, user);
    }

    return { requiresOTP: false, user };
  }

  /**
   * Mock OTP verification - accepts any code
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<MockUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const user = {
      ...MOCK_USERS.phone,
      id: `phone-${phoneNumber.replace(/\D/g, '')}`,
      name: `User ${phoneNumber.slice(-4)}`,
      email: `user${phoneNumber.slice(-4)}@example.com`,
    };

    this.currentUser = user;

    // Store in AsyncStorage for persistence
    await AsyncStorage.setItem('mockUser', JSON.stringify(user));
    await AsyncStorage.setItem('isAuthenticated', 'true');

    if (__DEV__) {
      console.log(`🔢 Mock OTP verification successful for ${phoneNumber} with code ${otp}:`, user);
    }

    return user;
  }

  /**
   * Guest mode - skip authentication
   */
  async loginAsGuest(): Promise<MockUser> {
    const user = MOCK_USERS.guest;
    this.currentUser = user;

    // Store in AsyncStorage for persistence
    await AsyncStorage.setItem('mockUser', JSON.stringify(user));
    await AsyncStorage.setItem('isAuthenticated', 'true');

    if (__DEV__) {
      console.log('👤 Mock guest login successful:', user);
    }

    return user;
  }

  /**
   * Get current user from memory or storage
   */
  async getCurrentUser(): Promise<MockUser | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const storedUser = await AsyncStorage.getItem('mockUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error retrieving mock user:', error);
    }

    return null;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const isAuth = await AsyncStorage.getItem('isAuthenticated');
    return isAuth === 'true';
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    this.currentUser = null;
    await AsyncStorage.removeItem('mockUser');
    await AsyncStorage.removeItem('isAuthenticated');

    if (__DEV__) {
      console.log('👋 Mock logout successful');
    }
  }

  /**
   * Quick development login shortcuts
   */
  async quickLogin(type: 'admin' | 'user' | 'guest'): Promise<MockUser> {
    let user: MockUser;

    switch (type) {
      case 'admin':
        user = MOCK_USERS.apple; // Admin user
        break;
      case 'user':
        user = MOCK_USERS.google; // Regular user
        break;
      case 'guest':
        user = MOCK_USERS.guest; // Guest user
        break;
      default:
        user = MOCK_USERS.google;
    }

    this.currentUser = user;

    // Store in AsyncStorage for persistence
    await AsyncStorage.setItem('mockUser', JSON.stringify(user));
    await AsyncStorage.setItem('isAuthenticated', 'true');

    if (__DEV__) {
      console.log(`⚡ Quick mock login as ${type}:`, user);
    }

    return user;
  }
}

export default MockAuthService.getInstance();
