import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

// MMKV for fast, synchronous storage
export const storage = new MMKV();

// Storage keys
export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Async Storage wrapper for complex data
export const AsyncStorageService = {
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error('Error saving to AsyncStorage:', e);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error reading from AsyncStorage:', e);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from AsyncStorage:', e);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing AsyncStorage:', e);
    }
  },
};

// MMKV wrapper for simple, fast storage
export const MMKVService = {
  setString(key: string, value: string): void {
    storage.set(key, value);
  },

  getString(key: string): string | undefined {
    return storage.getString(key);
  },

  setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  },

  getBoolean(key: string): boolean | undefined {
    return storage.getBoolean(key);
  },

  delete(key: string): void {
    storage.delete(key);
  },

  clearAll(): void {
    storage.clearAll();
  },
};