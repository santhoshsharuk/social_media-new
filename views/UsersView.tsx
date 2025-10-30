import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/firebase';
import { Spinner } from '../components/ui/Spinner';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export const UsersView: React.FC = () => {
  const { user: currentUser, follow, unfollow } = useAuth();
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const fetchedAdmins = await api.getAdmins();
        // Filter out the current user if they are an admin
        setAdmins(fetchedAdmins.filter(a => a.id !== currentUser?.id));
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [currentUser]);

  const handleFollowToggle = (adminId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollow(adminId);
    } else {
      follow(adminId);
    }
  };

  if(loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Follow Leaders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map(admin => {
          const isFollowing = currentUser?.following.includes(admin.id) ?? false;
          return (
            <div key={admin.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center flex flex-col items-center">
              <Avatar src={admin.photoURL} alt={admin.name} size="lg" />
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{admin.name}</h2>
              <p className="mt-1 text-sm text-brand-green font-semibold">{admin.role.toUpperCase()}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex-grow">{admin.bio}</p>
              <div className="mt-4">
                <Button 
                  size="sm" 
                  variant={isFollowing ? 'secondary' : 'primary'}
                  onClick={() => handleFollowToggle(admin.id, isFollowing)}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};
