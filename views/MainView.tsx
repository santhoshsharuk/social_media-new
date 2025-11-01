import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { FeedView } from './FeedView';
import { ProfileView } from './ProfileView';
import { AdminView } from './AdminView';
import { UsersView } from './UsersView';
import { SettingsView } from './SettingsView';
import { Page } from '../types';
import { BottomNavBar } from '../components/layout/BottomNavBar';

interface MainViewProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export const MainView: React.FC<MainViewProps> = ({ currentPage, setCurrentPage }) => {
  
  const renderContent = () => {
    switch(currentPage) {
      case 'feed':
        return <FeedView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <FeedView />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
      <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};