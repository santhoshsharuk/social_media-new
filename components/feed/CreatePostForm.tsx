
import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/firebase';
import { Post } from '../../types';
import { Button } from '../ui/Button';
import { compressImage, formatFileSize, getCompressionRatio } from '../../utils/imageCompression';

interface CreatePostFormProps {
  onPostCreated: (post: Post) => void;
}

interface MediaItem {
  file: File;
  preview: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  originalSize?: number;
  compressedSize?: number;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentAspectRatio, setCurrentAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setContent('');
    setMediaItems([]);
    setError('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setCompressing(true);
    setError('');

    try {
      const fileArray: File[] = Array.from(files);
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

      // Compress images with high quality settings
      const compressionPromises = imageFiles.map(async (file) => {
        const originalSize = file.size;
        
        // Compress image
        const compressedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
          maxSizeMB: 1
        });

        return {
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
          aspectRatio: currentAspectRatio,
          originalSize,
          compressedSize: compressedFile.size
        } as MediaItem;
      });

      const newMediaItems = await Promise.all(compressionPromises);

      // Log compression stats
      const totalOriginal = newMediaItems.reduce((sum, item) => sum + (item.originalSize || 0), 0);
      const totalCompressed = newMediaItems.reduce((sum, item) => sum + (item.compressedSize || 0), 0);
      console.log(`✅ Compressed ${imageFiles.length} images: ${formatFileSize(totalOriginal)} → ${formatFileSize(totalCompressed)} (${getCompressionRatio(totalOriginal, totalCompressed)})`);

      setMediaItems(prev => [...prev, ...newMediaItems]);
    } catch (err) {
      console.error('Compression error:', err);
      setError('Failed to process images. Please try again.');
    } finally {
      setCompressing(false);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaItems(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChangeAspectRatio = (index: number, ratio: '1:1' | '16:9' | '9:16') => {
    setMediaItems(prev => prev.map((item, i) => 
      i === index ? { ...item, aspectRatio: ratio } : item
    ));
  };

  const getAspectRatioClass = (ratio: '1:1' | '16:9' | '9:16') => {
    switch (ratio) {
      case '1:1': return 'aspect-square';
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    
    setLoading(true);
    setError('');

    try {
      let mediaURLs: string[] = [];
      
      if (mediaItems.length > 0) {
        // Upload all images
        const uploadPromises = mediaItems.map(item => api.uploadFile(item.file));
        mediaURLs = await Promise.all(uploadPromises);
      }

      // Store as JSON string with carousel data
      const mediaData = mediaItems.length > 0 ? JSON.stringify({
        urls: mediaURLs,
        aspectRatios: mediaItems.map(item => item.aspectRatio)
      }) : undefined;

      const newPostData = {
        authorId: user.id,
        content,
        mediaURL: mediaData,
        mediaType: mediaItems.length > 0 ? 'image' as const : undefined,
      };

      const createdPost = await api.createPost(newPostData);
      onPostCreated(createdPost);
      
      // Cleanup and reset
      mediaItems.forEach(item => URL.revokeObjectURL(item.preview));
      handleCloseModal();

    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Only show for admin users
  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <>
      {/* Trigger Button - Quick Post */}
      <button
        onClick={handleOpenModal}
        className="w-full flex items-center gap-3 p-4 bg-white dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark hover:shadow-md transition-all"
      >
        {user?.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user?.name}
            className="w-10 h-10 rounded-full border-2 border-primary object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-10 h-10 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center ${user?.photoURL ? 'hidden' : ''}`}>
          <span className="material-symbols-outlined text-primary text-xl">person</span>
        </div>
        <span className="flex-1 text-left text-text-muted-light dark:text-text-muted-dark">
          What's on your mind, {user?.name}?
        </span>
        <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
          <div 
            className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Create Post</h2>
              <button
                onClick={handleCloseModal}
                className="text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Compression Success Banner */}
              {mediaItems.length > 0 && mediaItems.some(item => item.originalSize && item.compressedSize) && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400">speed</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                        Images Optimized! ⚡
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Your images are compressed for faster upload and better storage management.
                        Original: {formatFileSize(mediaItems.reduce((sum, item) => sum + (item.originalSize || 0), 0))} → 
                        Compressed: {formatFileSize(mediaItems.reduce((sum, item) => sum + (item.compressedSize || 0), 0))}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* User Info */}
              <div className="flex items-center gap-3">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user?.name}
                    className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-12 h-12 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center ${user?.photoURL ? 'hidden' : ''}`}>
                  <span className="material-symbols-outlined text-primary text-2xl">person</span>
                </div>
                <div>
                  <p className="font-bold text-text-light dark:text-text-dark">{user?.name}</p>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Public</p>
                </div>
              </div>

              {/* Content Textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${user?.name}?`}
                className="w-full p-4 border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-text-light dark:text-text-dark resize-none"
                rows={4}
                required
              />

              {/* Media Preview Carousel */}
              {mediaItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-text-light dark:text-text-dark">
                      Media ({mediaItems.length})
                    </h3>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                      Swipe to view all
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {mediaItems.map((item, index) => (
                      <div key={index} className="relative border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
                        <img
                          src={item.preview}
                          alt={`Upload ${index + 1}`}
                          className={`w-full object-cover ${getAspectRatioClass(item.aspectRatio)}`}
                        />
                        
                        {/* Compression Info Badge */}
                        {item.originalSize && item.compressedSize && (
                          <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>
                              {formatFileSize(item.compressedSize)} • {getCompressionRatio(item.originalSize, item.compressedSize)}
                            </span>
                          </div>
                        )}

                        {/* Aspect Ratio Selector */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {(['1:1', '16:9', '9:16'] as const).map(ratio => (
                            <button
                              key={ratio}
                              type="button"
                              onClick={() => handleChangeAspectRatio(index, ratio)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                item.aspectRatio === ratio
                                  ? 'bg-primary text-white shadow-lg'
                                  : 'bg-white/90 text-gray-800 hover:bg-white'
                              }`}
                            >
                              {ratio}
                            </button>
                          ))}
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(index)}
                          className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                        >
                          <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Media Section */}
              <div className="border-2 border-dashed border-border-light dark:border-border-dark rounded-xl p-6 hover:border-primary transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="media-upload"
                  disabled={compressing}
                />
                
                <label
                  htmlFor="media-upload"
                  className={`flex flex-col items-center gap-3 ${compressing ? 'cursor-wait' : 'cursor-pointer'}`}
                >
                  {compressing ? (
                    <>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                        <span className="material-symbols-outlined text-4xl text-primary animate-spin">hourglass_empty</span>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-primary">Compressing images...</p>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                          Optimizing for faster upload
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-primary">add_photo_alternate</span>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-text-light dark:text-text-dark">Add Photos</p>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                          Auto-compressed for quality & speed ⚡
                        </p>
                      </div>
                    </>
                  )}
                </label>

                {/* Aspect Ratio Selector for Next Upload */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-sm text-text-muted-light dark:text-text-muted-dark">Default ratio:</span>
                  {(['1:1', '16:9', '9:16'] as const).map(ratio => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setCurrentAspectRatio(ratio)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                        currentAspectRatio === ratio
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || compressing || !content.trim()}
                className="w-full py-4 text-lg"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2">send</span>
                    Post
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
