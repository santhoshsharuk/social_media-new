
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Page } from '../../types';

interface HeaderProps {
    setCurrentPage: (page: Page) => void;
}

const FlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12" width="28" height="14" className="mr-2">
        <rect width="24" height="4" fill="#FF9933" />
        <rect y="4" width="24" height="4" fill="#FFFFFF" />
        <rect y="8" width="24" height="4" fill="#138808" />
        <circle cx="12" cy="6" r="1.5" fill="#000080" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('feed')}>
            <FlagIcon/>
            <h1 className="text-xl font-bold text-saffron">Productive Bharat</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => alert('Notifications clicked!')} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <div className="relative">
              <button onClick={() => setCurrentPage('profile')}>
                <Avatar src={user?.photoURL} alt={user?.name || 'User'} size="md" />
              </button>
            </div>
            <button onClick={logout} className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-saffron-dark dark:hover:text-saffron">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
