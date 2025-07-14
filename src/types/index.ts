export * from './navigation';

// Add your custom types here
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}