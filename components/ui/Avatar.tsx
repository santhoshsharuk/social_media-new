
import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md' }) => {
  return (
    <img
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 dark:border-gray-600`}
      src={src || `https://i.pravatar.cc/150?u=${alt}`}
      alt={alt}
    />
  );
};
