import { IStorageService, UploadOptions, StorageFile } from '../../interfaces/IStorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class MockStorageService implements IStorageService {
  private mockFiles: Map<string, StorageFile> = new Map();
  
  async upload(options: UploadOptions): Promise<{ url: string; path: string }> {
    const { bucket, path, file } = options;
    const fullPath = `${bucket}/${path}`;
    
    // Mock file storage
    const storageFile: StorageFile = {
      name: path.split('/').pop() || 'file',
      size: file.size || 0,
      type: file.type || 'application/octet-stream',
      lastModified: new Date(),
      url: `mock://storage/${fullPath}`,
    };
    
    this.mockFiles.set(fullPath, storageFile);
    
    // Store metadata in AsyncStorage
    await AsyncStorage.setItem(
      `mock-storage-${fullPath}`,
      JSON.stringify(storageFile)
    );
    
    return {
      url: storageFile.url,
      path: fullPath,
    };
  }
  
  async download(bucket: string, path: string): Promise<Blob> {
    const fullPath = `${bucket}/${path}`;
    const file = this.mockFiles.get(fullPath);
    
    if (!file) {
      throw new Error('File not found');
    }
    
    // Return mock blob
    return new Blob(['mock file content'], { type: file.type });
  }
  
  async delete(bucket: string, path: string): Promise<void> {
    const fullPath = `${bucket}/${path}`;
    this.mockFiles.delete(fullPath);
    await AsyncStorage.removeItem(`mock-storage-${fullPath}`);
  }
  
  async list(bucket: string, path?: string): Promise<StorageFile[]> {
    const prefix = path ? `${bucket}/${path}` : bucket;
    const files: StorageFile[] = [];
    
    for (const [filePath, file] of this.mockFiles) {
      if (filePath.startsWith(prefix)) {
        files.push(file);
      }
    }
    
    return files;
  }
  
  getPublicUrl(bucket: string, path: string): string {
    return `mock://storage/${bucket}/${path}`;
  }
  
  async createBucket(name: string, isPublic?: boolean): Promise<void> {
    console.log(`Mock: Created bucket "${name}" (public: ${isPublic})`);
  }
}