
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { GoalsTracker } from '../components/profile/GoalsTracker';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';

export const ProfileView: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Please log in to see your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Avatar src={user.photoURL} alt={user.name} size="xl" />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-md text-saffron">{user.email}</p>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{user.bio}</p>
          </div>
           <div className="sm:ml-auto">
            <Button onClick={() => alert('Edit profile functionality not implemented yet.')}>Edit Profile</Button>
          </div>
        </div>
      </div>

      <GoalsTracker initialGoals={user.goals} />

      <div className="text-center">
        <Button onClick={logout} variant="danger">Log Out</Button>
      </div>
    </div>
  );
};
