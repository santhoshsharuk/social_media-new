import React, { useState } from 'react';
import { Post } from '../../types';

interface ShareModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ post, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const postUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const handleShare = (platform: string) => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedText = encodeURIComponent(post.content.substring(0, 100));
    const encodedTitle = encodeURIComponent(`Post by ${post.authorName}`);

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full sm:w-auto sm:min-w-[400px] bg-white dark:bg-surface-dark rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideInUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-text-light dark:text-text-dark">
              Share this post
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">
                close
              </span>
            </button>
          </div>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-2">
            {post.content.substring(0, 100)}...
          </p>
        </div>

        {/* Share Options */}
        <div className="p-4 sm:p-6">
          {/* Copy Link */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">
              Copy link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={postUrl}
                readOnly
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-text-light dark:text-text-dark px-4 py-3 rounded-lg text-sm border border-border-light dark:border-border-dark"
              />
              <button
                onClick={handleCopyLink}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            </div>
          </div>

          {/* Social Media Platforms */}
          <div>
            <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-3">
              Share via
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark group-hover:text-text-light dark:group-hover:text-text-dark">
                  WhatsApp
                </span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                  <span className="material-symbols-outlined">public</span>
                </div>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark group-hover:text-text-light dark:group-hover:text-text-dark">
                  Facebook
                </span>
              </button>

              {/* Twitter */}
              <button
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white text-2xl">
                  <span className="material-symbols-outlined">flutter_dash</span>
                </div>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark group-hover:text-text-light dark:group-hover:text-text-dark">
                  Twitter
                </span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white text-2xl">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark group-hover:text-text-light dark:group-hover:text-text-dark">
                  LinkedIn
                </span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => handleShare('telegram')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                  <span className="material-symbols-outlined">send</span>
                </div>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark group-hover:text-text-light dark:group-hover:text-text-dark">
                  Telegram
                </span>
              </button>

              {/* Email */}
              <button
                onClick={() => handleShare('email')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark group-hover:text-text-light dark:group-hover:text-text-dark">
                  Email
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 border-t border-border-light dark:border-border-dark">
          <p className="text-xs text-center text-text-muted-light dark:text-text-muted-dark">
            Share count will be updated when link is shared
          </p>
        </div>
      </div>
    </div>
  );
};
