// Cloudinary configuration and upload utility
// Alternative to Firebase Storage with better free tier (25GB vs 5GB)

export const CLOUDINARY_CONFIG = {
  cloudName: 'dyqz8xwva', // ✅ Your Cloudinary cloud name
  uploadPreset: 'social_media_uploads', // Must match the preset created in Cloudinary dashboard
};

/**
 * Upload file to Cloudinary
 * @param file - File to upload (Image/Video)
 * @returns URL of uploaded file
 * @throws Error if upload fails
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  // Validate file before upload
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only images are allowed.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
  
  // Optional: Add folder organization
  formData.append('folder', 'social_media/posts');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    
    // Return secure HTTPS URL
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload image');
  }
}

/**
 * Upload with progress tracking
 * @param file - File to upload
 * @param onProgress - Callback for upload progress (0-100)
 * @returns URL of uploaded file
 */
export async function uploadToCloudinaryWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
    formData.append('folder', 'social_media/posts');

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`
    );
    xhr.send(formData);
  });
}

/**
 * Get optimized image URL with transformations
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 * @returns Optimized URL with transformations applied
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string {
  if (!url || !url.includes('cloudinary')) {
    return url;
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options || {};

  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformation = transformations.join(',');

  // Insert transformation into URL
  return url.replace('/upload/', `/upload/${transformation}/`);
}

/**
 * Get thumbnail URL (small optimized version)
 * @param url - Original Cloudinary URL
 * @returns Thumbnail URL (200x200)
 */
export function getThumbnailUrl(url: string): string {
  return getOptimizedImageUrl(url, {
    width: 200,
    height: 200,
    crop: 'fill',
    quality: 'auto',
  });
}

/**
 * Get medium size image URL
 * @param url - Original Cloudinary URL
 * @returns Medium size URL (800x600)
 */
export function getMediumImageUrl(url: string): string {
  return getOptimizedImageUrl(url, {
    width: 800,
    height: 600,
    crop: 'fit',
    quality: 'auto',
  });
}

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID (used for deletion)
 */
export function getPublicIdFromUrl(url: string): string | null {
  try {
    // Handle URLs with transformations and without
    // Example: https://res.cloudinary.com/cloud/image/upload/v123456/folder/image.jpg
    // Or: https://res.cloudinary.com/cloud/image/upload/w_800,h_600/v123456/folder/image.jpg
    const urlParts = url.split('/upload/');
    if (urlParts.length < 2) return null;
    
    const afterUpload = urlParts[1];
    // Remove transformations if present (they start with letters like w_, h_, etc)
    const pathMatch = afterUpload.match(/(?:v\d+\/)?(.*?)\.[\w]+$/);
    
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}

/**
 * Extract all public IDs from carousel JSON data
 * @param carouselData - JSON string with {urls: string[], aspectRatios: string[]}
 * @returns Array of public IDs
 */
export function getPublicIdsFromCarousel(carouselData: string): string[] {
  try {
    const data = JSON.parse(carouselData);
    if (data.urls && Array.isArray(data.urls)) {
      return data.urls
        .map(url => getPublicIdFromUrl(url))
        .filter((id): id is string => id !== null);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Delete image from Cloudinary
 * Note: This requires API Secret and should be done on backend
 * For frontend-only apps, just remove the reference from database
 * @param publicId - Public ID of the image
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  console.warn(
    'Delete operation requires API Secret and should be done on backend.',
    'For now, just remove the reference from your database.',
    'Public ID:', publicId
  );
  
  // In production, call your backend API:
  // await fetch('/api/delete-image', {
  //   method: 'POST',
  //   body: JSON.stringify({ publicId }),
  // });
}

/**
 * Check if Cloudinary is properly configured
 * @returns true if configured, false otherwise
 */
export function isCloudinaryConfigured(): boolean {
  return (
    CLOUDINARY_CONFIG.cloudName !== 'YOUR_CLOUD_NAME' &&
    CLOUDINARY_CONFIG.cloudName.length > 0
  );
}

/**
 * Validate Cloudinary configuration
 * Throws error if not configured properly
 */
export function validateCloudinaryConfig(): void {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Please set CLOUDINARY_CONFIG.cloudName in services/cloudinary.ts'
    );
  }
}
