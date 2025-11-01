import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsView: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      setLoggingOut(true);
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
        setLoggingOut(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark p-6">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark flex items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary">settings</span>
          Settings
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Account Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">account_circle</span>
            Account
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 bg-background-light dark:bg-gray-800 rounded-lg">
            <img
              src={user?.photoURL}
              alt={user?.name}
              className="w-16 h-16 rounded-full border-2 border-primary"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-text-light dark:text-text-dark">{user?.name}</h3>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{user?.email}</p>
              <p className="text-xs text-primary mt-1 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">palette</span>
            Appearance
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-background-light dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-text-light dark:text-text-dark">
                {theme === 'dark' ? 'dark_mode' : 'light_mode'}
              </span>
              <div>
                <h3 className="font-semibold text-text-light dark:text-text-dark">Theme</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{ backgroundColor: theme === 'dark' ? '#ff9933' : '#e5e7eb' }}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">shield</span>
            Privacy & Security
          </h2>
        </div>
        
        <div className="p-6 space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-background-light dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-text-light dark:text-text-dark">lock</span>
              <span className="font-medium text-text-light dark:text-text-dark">Change Password</span>
            </div>
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">
              chevron_right
            </span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-background-light dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-text-light dark:text-text-dark">privacy_tip</span>
              <span className="font-medium text-text-light dark:text-text-dark">Privacy Settings</span>
            </div>
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">
              chevron_right
            </span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-background-light dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-text-light dark:text-text-dark">block</span>
              <span className="font-medium text-text-light dark:text-text-dark">Blocked Users</span>
            </div>
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span>
            About
          </h2>
        </div>
        
        <div className="p-6 space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-background-light dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-text-light dark:text-text-dark">description</span>
              <span className="font-medium text-text-light dark:text-text-dark">Terms of Service</span>
            </div>
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">
              chevron_right
            </span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-background-light dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl text-text-light dark:text-text-dark">policy</span>
              <span className="font-medium text-text-light dark:text-text-dark">Privacy Policy</span>
            </div>
            <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">
              chevron_right
            </span>
          </button>

          <div className="p-4 bg-background-light dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark text-center">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>

      {/* Sign Out Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark overflow-hidden">
        <div className="p-6">
          <Button
            onClick={handleLogout}
            variant="danger"
            className="w-full text-lg py-4"
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                Signing Out...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined mr-2">logout</span>
                Sign Out
              </>
            )}
          </Button>
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark text-center mt-3">
            You will be logged out of your account
          </p>
        </div>
      </div>
    </div>
  );
};
