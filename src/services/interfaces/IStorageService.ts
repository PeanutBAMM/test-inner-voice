export interface UploadOptions {
  bucket: string;
  path: string;
  file: File | Blob;
  metadata?: Record<string, any>;
}

export interface StorageFile {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  url: string;
}

export interface IStorageService {
  upload(options: UploadOptions): Promise<{ url: string; path: string }>;
  download(bucket: string, path: string): Promise<Blob>;
  delete(bucket: string, path: string): Promise<void>;
  list(bucket: string, path?: string): Promise<StorageFile[]>;
  getPublicUrl(bucket: string, path: string): string;
  createBucket(name: string, isPublic?: boolean): Promise<void>;
}