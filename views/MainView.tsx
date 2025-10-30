import React from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { Footer } from '../components/layout/Footer';
import { FeedView } from './FeedView';
import { ChatView } from './ChatView';
import { ProfileView } from './ProfileView';
import { AdminView } from './AdminView';
import { UsersView } from './UsersView';
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
      case 'chat':
        return <ChatView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      case 'users':
        return <UsersView />;
      default:
        return <FeedView />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header setCurrentPage={setCurrentPage} />
      <div className="flex flex-1">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-800 overflow-y-auto pb-24 md:pb-6 lg:pb-8">
          {renderContent()}
        </main>
      </div>
      <Footer />
      <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};