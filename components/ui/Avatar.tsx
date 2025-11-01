
import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-16 w-16 text-2xl',
  xl: 'h-24 w-24 text-4xl',
};

const AvatarComponent: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center flex-shrink-0`}
      >
        <span className="material-symbols-outlined text-primary">person</span>
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0">
      <img
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-primary dark:border-gray-600 transition-opacity duration-300 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('Avatar image failed to load:', src);
          setImageError(true);
        }}
        onLoad={() => {
          console.log('Avatar image loaded successfully:', src);
          setImageLoaded(true);
        }}
      />
      {!imageLoaded && !imageError && (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse absolute top-0 left-0`} />
      )}
    </div>
  );
};

AvatarComponent.displayName = 'Avatar';

export const Avatar = React.memo(AvatarComponent);
