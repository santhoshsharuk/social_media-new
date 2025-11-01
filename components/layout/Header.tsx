
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Page } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
    currentPage: Page;
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

export const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm hidden md:block">
      <div className="flex items-center p-4 pb-2 justify-between">
        <div className="flex shrink-0 items-center justify-start w-12 gap-2 cursor-pointer" onClick={() => setCurrentPage('feed')}>
          <span className="material-symbols-outlined text-primary text-3xl">all_inclusive</span>
        </div>
        <h1 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em] flex-1">
          Productive Bharat
        </h1>
        <div className="flex items-center justify-end gap-2">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-text-light dark:text-text-dark hover:bg-primary/10 transition-all"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          {/* Notifications */}
          <button 
            onClick={() => alert('Notifications clicked!')} 
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-text-light dark:text-text-dark hover:bg-primary/10 transition-all relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            <div className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface-light dark:border-surface-dark"></div>
          </button>

          {/* Settings */}
          <button 
            onClick={() => setCurrentPage('settings')} 
            className={`flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 transition-all ${
              currentPage === 'settings'
                ? 'bg-primary/20 text-primary'
                : 'bg-transparent text-text-light dark:text-text-dark hover:bg-primary/10'
            }`}
            title="Settings"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="px-4">
        <div className="flex border-b border-border-light dark:border-border-dark gap-8">
          <button 
            onClick={() => setCurrentPage('feed')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 ${
              currentPage === 'feed' 
                ? 'border-b-primary' 
                : 'border-b-transparent'
            }`}
          >
            <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
              currentPage === 'feed' 
                ? 'text-primary' 
                : 'text-text-muted-light dark:text-text-muted-dark'
            }`}>
              Feed
            </p>
          </button>
          <button 
            onClick={() => setCurrentPage('users')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 ${
              currentPage === 'users' 
                ? 'border-b-primary' 
                : 'border-b-transparent'
            }`}
          >
            <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
              currentPage === 'users' 
                ? 'text-primary' 
                : 'text-text-muted-light dark:text-text-muted-dark'
            }`}>
              Network
            </p>
          </button>
          <button 
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 ${
              currentPage === 'profile' 
                ? 'border-b-primary' 
                : 'border-b-transparent'
            }`}
          >
            <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
              currentPage === 'profile' 
                ? 'text-primary' 
                : 'text-text-muted-light dark:text-text-muted-dark'
            }`}>
              Profile
            </p>
          </button>
          {user?.role === 'admin' && (
            <button 
              onClick={() => setCurrentPage('admin')}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 gap-1 ${
                currentPage === 'admin' 
                  ? 'border-b-primary' 
                  : 'border-b-transparent'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${
                currentPage === 'admin' 
                  ? 'text-primary' 
                  : 'text-text-muted-light dark:text-text-muted-dark'
              }`}>
                admin_panel_settings
              </span>
              <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                currentPage === 'admin' 
                  ? 'text-primary' 
                  : 'text-text-muted-light dark:text-text-muted-dark'
              }`}>
                Admin
              </p>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
