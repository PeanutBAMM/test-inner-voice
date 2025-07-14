import { IDatabaseService, QueryOptions, RealtimeSubscription } from '../../interfaces/IDatabaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class MockDatabaseService implements IDatabaseService {
  private mockData: Map<string, Map<string, any>> = new Map();
  private subscriptions: Map<string, Set<(data: any) => void>> = new Map();
  
  constructor() {
    // Initialize with some mock data
    this.initializeMockData();
  }
  
  private async initializeMockData() {
    // Load any persisted mock data from AsyncStorage
    try {
      const keys = await AsyncStorage.getAllKeys();
      const dbKeys = keys.filter(key => key.startsWith('mock-db-'));
      
      for (const key of dbKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const [, , table, id] = key.split('-');
          if (!this.mockData.has(table)) {
            this.mockData.set(table, new Map());
          }
          this.mockData.get(table)!.set(id, JSON.parse(data));
        }
      }
    } catch (error) {
      console.error('Error loading mock data:', error);
    }
  }
  
  async create<T>(table: string, data: Partial<T>): Promise<T> {
    if (!this.mockData.has(table)) {
      this.mockData.set(table, new Map());
    }
    
    const id = Math.random().toString(36).substr(2, 9);
    const record = {
      ...data,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as T;
    
    this.mockData.get(table)!.set(id, record);
    
    // Persist to AsyncStorage
    await AsyncStorage.setItem(
      `mock-db-${table}-${id}`,
      JSON.stringify(record)
    );
    
    // Notify subscribers
    this.notifySubscribers(table, { event: 'INSERT', data: record });
    
    return record;
  }
  
  async read<T>(table: string, id: string): Promise<T | null> {
    const tableData = this.mockData.get(table);
    if (!tableData) return null;
    
    return tableData.get(id) || null;
  }
  
  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const existing = await this.read<T>(table, id);
    if (!existing) {
      throw new Error(`Record not found: ${table}/${id}`);
    }
    
    const updated = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString(),
    } as T;
    
    this.mockData.get(table)!.set(id, updated);
    
    // Persist to AsyncStorage
    await AsyncStorage.setItem(
      `mock-db-${table}-${id}`,
      JSON.stringify(updated)
    );
    
    // Notify subscribers
    this.notifySubscribers(table, { event: 'UPDATE', data: updated });
    
    return updated;
  }
  
  async delete(table: string, id: string): Promise<void> {
    const tableData = this.mockData.get(table);
    if (!tableData || !tableData.has(id)) {
      throw new Error(`Record not found: ${table}/${id}`);
    }
    
    const record = tableData.get(id);
    tableData.delete(id);
    
    // Remove from AsyncStorage
    await AsyncStorage.removeItem(`mock-db-${table}-${id}`);
    
    // Notify subscribers
    this.notifySubscribers(table, { event: 'DELETE', data: record });
  }
  
  async query<T>(table: string, options?: QueryOptions): Promise<T[]> {
    const tableData = this.mockData.get(table);
    if (!tableData) return [];
    
    let results = Array.from(tableData.values());
    
    // Apply filters
    if (options?.filters) {
      results = results.filter(record => {
        return Object.entries(options.filters!).every(([key, value]) => {
          return record[key] === value;
        });
      });
    }
    
    // Apply ordering
    if (options?.orderBy) {
      const { column, ascending = true } = options.orderBy;
      results.sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return ascending ? comparison : -comparison;
      });
    }
    
    // Apply pagination
    if (options?.offset !== undefined) {
      results = results.slice(options.offset);
    }
    if (options?.limit !== undefined) {
      results = results.slice(0, options.limit);
    }
    
    return results as T[];
  }
  
  async count(table: string, filters?: Record<string, any>): Promise<number> {
    const results = await this.query(table, { filters });
    return results.length;
  }
  
  subscribe<T>(
    table: string,
    callback: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE'; data: T }) => void,
    filters?: Record<string, any>
  ): RealtimeSubscription {
    if (!this.subscriptions.has(table)) {
      this.subscriptions.set(table, new Set());
    }
    
    // Wrap callback to apply filters
    const wrappedCallback = (payload: any) => {
      if (filters) {
        const matchesFilters = Object.entries(filters).every(([key, value]) => {
          return payload.data[key] === value;
        });
        if (!matchesFilters) return;
      }
      callback(payload);
    };
    
    this.subscriptions.get(table)!.add(wrappedCallback);
    
    return {
      unsubscribe: () => {
        const subs = this.subscriptions.get(table);
        if (subs) {
          subs.delete(wrappedCallback);
        }
      },
    };
  }
  
  async sql<T>(query: string, params?: any[]): Promise<T[]> {
    console.warn('Mock database: SQL queries not supported in mock mode');
    return [];
  }
  
  private notifySubscribers(table: string, payload: any) {
    const subs = this.subscriptions.get(table);
    if (subs) {
      subs.forEach(callback => callback(payload));
    }
  }
}