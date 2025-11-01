
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { GoalsTracker } from '../components/profile/GoalsTracker';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { api } from '../services/firebase';
import { Spinner } from '../components/ui/Spinner';
import { EditProfileModal } from '../components/profile/EditProfileModal';

export const ProfileView: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [postsCount, setPostsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Fetch all posts and count user's posts
        const allPosts = await api.getPosts();
        const userPosts = allPosts.filter(post => post.authorId === user.id);
        setPostsCount(userPosts.length);
        
        // Get followers and following from user data
        setFollowersCount(user.followers?.length || 0);
        setFollowingCount(user.following?.length || 0);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  if (!user) {
    return <div>Please log in to see your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="p-6 bg-white dark:bg-surface-dark rounded-lg shadow-md border border-border-light dark:border-border-dark">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Google Profile Image */}
          <div className="relative">
            <img 
              src={user.photoURL || 'https://via.placeholder.com/120'} 
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">{user.name}</h1>
            <p className="text-md text-primary font-medium">{user.email}</p>
            {user.bio && <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">{user.bio}</p>}
            <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
              <div className="text-center">
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">{postsCount}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Posts</p>
                  </>
                )}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">{followersCount}</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-light dark:text-text-dark">{followingCount}</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Following</p>
              </div>
            </div>
          </div>
           <div className="sm:ml-auto">
            <Button onClick={() => setIsEditModalOpen(true)}>
              <span className="material-symbols-outlined mr-2">edit</span>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <GoalsTracker initialGoals={user.goals} />

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={updateProfile}
      />
    </div>
  );
};
