import React, { useState } from 'react';
import { uploadToCloudinary, isCloudinaryConfigured, CLOUDINARY_CONFIG } from '../../services/cloudinary';
import { STORAGE_CONFIG } from '../../services/storageConfig';
import { Button } from '../ui/Button';

/**
 * Storage Test Component
 * Use this to test if Cloudinary upload is working
 * Remove after testing
 */
export const StorageTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const testUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus('Uploading...');
    setImageUrl('');

    try {
      // Check configuration
      if (!isCloudinaryConfigured()) {
        throw new Error('Cloudinary not configured');
      }

      // Upload file
      const url = await uploadToCloudinary(file);
      
      setStatus('✅ Upload successful!');
      setImageUrl(url);
      console.log('Uploaded image URL:', url);
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 border-2 border-blue-500 p-6 rounded-lg shadow-xl max-w-md z-50">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        🧪 Storage Test
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="font-semibold">Provider:</p>
          <p className="text-green-600">{STORAGE_CONFIG.provider}</p>
        </div>

        {STORAGE_CONFIG.provider === 'cloudinary' && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <p className="font-semibold">Cloud Name:</p>
            <p className="text-green-600">{CLOUDINARY_CONFIG.cloudName}</p>
            <p className="font-semibold mt-2">Preset:</p>
            <p className="text-green-600">{CLOUDINARY_CONFIG.uploadPreset}</p>
          </div>
        )}

        <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
          <p className="font-semibold mb-2">Test Upload:</p>
          <input
            type="file"
            accept="image/*"
            onChange={testUpload}
            disabled={loading}
            className="text-sm"
          />
        </div>

        {status && (
          <div className={`p-3 rounded ${
            status.includes('✅') 
              ? 'bg-green-100 text-green-800' 
              : status.includes('❌')
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status}
          </div>
        )}

        {imageUrl && (
          <div className="space-y-2">
            <img 
              src={imageUrl} 
              alt="Uploaded test" 
              className="w-full rounded border-2 border-green-500"
            />
            <p className="text-xs text-gray-500 break-all">{imageUrl}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4 italic">
        ⚠️ Remove this component after testing
      </p>
    </div>
  );
};
