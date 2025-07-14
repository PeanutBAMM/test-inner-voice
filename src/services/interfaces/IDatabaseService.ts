export interface QueryOptions {
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
}

export interface RealtimeSubscription {
  unsubscribe(): void;
}

export interface IDatabaseService {
  // CRUD Operations
  create<T>(table: string, data: Partial<T>): Promise<T>;
  read<T>(table: string, id: string): Promise<T | null>;
  update<T>(table: string, id: string, data: Partial<T>): Promise<T>;
  delete(table: string, id: string): Promise<void>;
  
  // Query Operations
  query<T>(table: string, options?: QueryOptions): Promise<T[]>;
  count(table: string, filters?: Record<string, any>): Promise<number>;
  
  // Realtime
  subscribe<T>(
    table: string,
    callback: (payload: { event: 'INSERT' | 'UPDATE' | 'DELETE'; data: T }) => void,
    filters?: Record<string, any>
  ): RealtimeSubscription;
  
  // Raw SQL (for advanced queries)
  sql<T>(query: string, params?: any[]): Promise<T[]>;
}