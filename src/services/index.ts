// Service Provider - Injectable backend implementation
// Default: Mock services for development
// Can be replaced by setup-apex-backend.sh script

import { IAuthService } from './interfaces/IAuthService';
import { IStorageService } from './interfaces/IStorageService';
import { IDatabaseService } from './interfaces/IDatabaseService';

// Import mock implementations by default
import { MockAuthService } from './implementations/mock/MockAuthService';
import { MockStorageService } from './implementations/mock/MockStorageService';
import { MockDatabaseService } from './implementations/mock/MockDatabaseService';

// BACKEND_INJECTION_START
// These lines will be replaced by setup-apex-backend.sh when configuring real backend
export const authService: IAuthService = new MockAuthService();
export const storageService: IStorageService = new MockStorageService();
export const databaseService: IDatabaseService = new MockDatabaseService();
// BACKEND_INJECTION_END

// Export interfaces for type safety
export type { IAuthService, User, AuthSession } from './interfaces/IAuthService';
export type { IStorageService, UploadOptions, StorageFile } from './interfaces/IStorageService';
export type { IDatabaseService, QueryOptions, RealtimeSubscription } from './interfaces/IDatabaseService';