import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/firebase';
import { Spinner } from '../components/ui/Spinner';
import { SkeletonUserGrid } from '../components/ui/SkeletonUserCard';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export const UsersView: React.FC = () => {
  const { user: currentUser, follow, unfollow } = useAuth();
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'following'>('all');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const fetchedAdmins = await api.getAdmins();
        console.log('Fetched admins:', fetchedAdmins);
        fetchedAdmins.forEach(admin => {
          console.log(`Admin ${admin.name} photoURL:`, admin.photoURL);
        });
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

  const handleFollowToggle = async (adminId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await unfollow(adminId);
      } else {
        await follow(adminId);
      }
      
      // Refresh admin data to show updated follower counts
      const updatedAdmins = await api.getAdmins();
      setAdmins(updatedAdmins.filter(a => a.id !== currentUser?.id));
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const filteredAdmins = filter === 'all' 
    ? admins 
    : admins.filter(admin => currentUser?.following?.includes(admin.id));

  const followingCount = admins.filter(admin => currentUser?.following?.includes(admin.id)).length;

  if(loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background-light to-gray-50 dark:from-background-dark dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 sm:pb-6">
          {/* Hero Header Skeleton */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <div className="h-8 w-48 skeleton rounded-lg mb-2" />
                  <div className="h-4 w-64 skeleton rounded" />
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 w-20 h-20" />
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 w-20 h-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="mb-6">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-1 flex gap-1">
              <div className="flex-1 h-12 skeleton rounded-lg" />
              <div className="flex-1 h-12 skeleton rounded-lg" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <SkeletonUserGrid count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-gray-50 dark:from-background-dark dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 sm:pb-6">
        
        {/* Hero Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                  <span className="material-symbols-outlined text-4xl sm:text-5xl">diversity_3</span>
                  Your Network
                </h1>
                <p className="text-white/90 text-sm sm:text-base">Connect with leaders and grow together</p>
              </div>
              <div className="flex gap-3 sm:gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl sm:text-3xl font-bold">{admins.length}</p>
                  <p className="text-xs sm:text-sm text-white/80">Leaders</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
                  <p className="text-2xl sm:text-3xl font-bold">{followingCount}</p>
                  <p className="text-xs sm:text-sm text-white/80">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-1 flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                filter === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg sm:text-xl">groups</span>
                <span>All Leaders</span>
                <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">{admins.length}</span>
              </span>
            </button>
            <button
              onClick={() => setFilter('following')}
              className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                filter === 'following'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg sm:text-xl">check_circle</span>
                <span>Following</span>
                <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">{followingCount}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Leaders Grid */}
        {filteredAdmins.length === 0 ? (
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark p-8 sm:p-12 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-4xl sm:text-5xl text-text-muted-light dark:text-text-muted-dark">
                {filter === 'following' ? 'person_search' : 'group_off'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text-light dark:text-text-dark mb-2">
              {filter === 'following' ? 'Not following anyone yet' : 'No leaders found'}
            </h3>
            <p className="text-sm sm:text-base text-text-muted-light dark:text-text-muted-dark mb-6">
              {filter === 'following' 
                ? 'Start following leaders to see them here!' 
                : 'Check back later for inspiring leaders to connect with.'}
            </p>
            {filter === 'following' && (
              <button
                onClick={() => setFilter('all')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg transition-all"
              >
                Discover Leaders
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredAdmins.map((admin, index) => {
              const isFollowing = currentUser?.following?.includes(admin.id) ?? false;
              return (
                <div 
                  key={admin.id} 
                  className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden hover:shadow-xl transition-all group animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Profile Header with Gradient */}
                  <div className="relative h-24 sm:h-32 bg-gradient-to-r from-primary to-orange-600">
                    <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        {console.log('Rendering Avatar for:', admin.name, 'photoURL:', admin.photoURL)}
                        <Avatar src={admin.photoURL} alt={admin.name} size="xl" />
                        {isFollowing && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-surface-dark flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-sm">check</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="pt-12 sm:pt-14 px-4 sm:px-6 pb-4 sm:pb-6 text-center">
                    <h2 className="text-lg sm:text-xl font-bold text-text-light dark:text-text-dark mb-1">
                      {admin.name}
                    </h2>
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <span className="material-symbols-outlined text-primary text-sm">admin_panel_settings</span>
                      <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wide">
                        {admin.role}
                      </p>
                    </div>
                    
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4 line-clamp-2 min-h-[2.5rem]">
                      {admin.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 mb-4 py-3 border-y border-border-light dark:border-border-dark">
                      <div className="text-center">
                        <p className="text-lg font-bold text-text-light dark:text-text-dark">
                          {admin.followers?.length || 0}
                        </p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Followers</p>
                      </div>
                      <div className="w-px h-8 bg-border-light dark:border-border-dark"></div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-text-light dark:text-text-dark">
                          {admin.following?.length || 0}
                        </p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Following</p>
                      </div>
                    </div>

                    {/* Follow Button */}
                    <button
                      onClick={() => handleFollowToggle(admin.id, isFollowing)}
                      className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all shadow-md ${
                        isFollowing
                          ? 'bg-gray-100 dark:bg-gray-800 text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          {isFollowing ? 'check_circle' : 'person_add'}
                        </span>
                        {isFollowing ? 'Following' : 'Follow'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
