
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isRound?: boolean;
}

export const Button: React.FC<ButtonProps> = React.memo(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isRound = false,
  ...props
}) => {
  const baseClasses = 'font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary flex items-center justify-center',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500 flex items-center justify-center',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 flex items-center justify-center',
  };

  const sizeClasses = {
    sm: isRound ? 'p-2' : 'py-2 px-3 text-sm',
    md: isRound ? 'p-2.5' : 'py-2 px-4 text-sm',
    lg: isRound ? 'p-3' : 'py-3 px-6 text-base',
  };

  const shapeClasses = isRound ? 'rounded-full' : 'rounded-md shadow-sm';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${shapeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
