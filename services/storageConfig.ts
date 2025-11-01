// Storage Provider Configuration
// Switch between Firebase Storage and Cloudinary

export type StorageProvider = 'firebase' | 'cloudinary';

/**
 * Configure which storage provider to use
 * Change this to switch between Firebase Storage and Cloudinary
 */
export const STORAGE_CONFIG = {
  // ✅ Now using Cloudinary (25 GB free storage!)
  provider: 'cloudinary' as StorageProvider,
  
  // Set to true to see upload logs in console
  debug: true,
};

/**
 * Log upload information if debug is enabled
 */
export function logUpload(message: string, data?: any): void {
  if (STORAGE_CONFIG.debug) {
    console.log(`[Storage Upload] ${message}`, data || '');
  }
}

/**
 * Get the current storage provider name
 */
export function getStorageProviderName(): string {
  return STORAGE_CONFIG.provider === 'firebase' ? 'Firebase Storage' : 'Cloudinary';
}
