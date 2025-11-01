import React, { useState, useEffect } from 'react';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostForm } from '../components/feed/CreatePostForm';
import { Post } from '../types';
import { api } from '../services/firebase';
import { Spinner } from '../components/ui/Spinner';
import { SkeletonCardList } from '../components/ui/SkeletonCard';
import { useAuth } from '../hooks/useAuth';

export const FeedView: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'following'>('all');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const fetchedPosts = await api.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // Check URL for post ID on mount
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    if (postId) {
      setSelectedPostId(postId);
    }
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prevPosts => 
      prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post)
    );
  };

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => user?.following?.includes(post.authorId));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-light to-gray-50 dark:from-background-dark dark:to-gray-900">
      {/* Main Container */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Welcome Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0] || 'Friend'}! 👋</h1>
                <p className="text-white/90 text-sm sm:text-base">What's on your mind today?</p>
              </div>
              <div className="hidden sm:block w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-4xl">home</span>
              </div>
            </div>
          </div>
        </div>

        {/* Create Post Section - Admin Only */}
        {user?.role === 'admin' && (
          <div className="mb-4 sm:mb-6">
            <CreatePostForm onPostCreated={handlePostCreated} />
          </div>
        )}

        {/* Filter Tabs - Mobile Friendly */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-1 flex gap-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                activeFilter === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg sm:text-xl">public</span>
                <span className="hidden sm:inline">All Posts</span>
                <span className="sm:hidden">All</span>
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('following')}
              className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                activeFilter === 'following'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg sm:text-xl">group</span>
                <span className="hidden sm:inline">Following</span>
                <span className="sm:hidden">Friends</span>
              </span>
            </button>
          </div>
        </div>

        {/* Posts Count Badge */}
        {!loading && filteredPosts.length > 0 && (
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark">
              <span className="material-symbols-outlined text-lg">article</span>
              <span className="text-sm font-medium">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'Post' : 'Posts'}
              </span>
            </div>
            <button 
              onClick={() => fetchPosts(true)}
              disabled={refreshing}
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm font-medium disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
              <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        )}

        {/* Feed Section */}
        {loading ? (
          <SkeletonCardList count={3} />
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark p-8 sm:p-12 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-4xl sm:text-5xl text-text-muted-light dark:text-text-muted-dark">
                {activeFilter === 'following' ? 'group_off' : 'post_add'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text-light dark:text-text-dark mb-2">
              {activeFilter === 'following' ? 'No posts from friends' : 'No posts yet'}
            </h3>
            <p className="text-sm sm:text-base text-text-muted-light dark:text-text-muted-dark mb-6 max-w-md mx-auto">
              {activeFilter === 'following' 
                ? 'Follow more people to see their posts here!' 
                : 'Be the first to share something with the community!'}
            </p>
            {activeFilter === 'following' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg transition-all text-sm sm:text-base"
              >
                View All Posts
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-6">
            {filteredPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PostCard 
                  post={post} 
                  onUpdate={handlePostUpdate}
                  isOpenByDefault={selectedPostId === post.id}
                  onModalClose={() => {
                    setSelectedPostId(null);
                    // Remove post parameter from URL
                    const url = new URL(window.location.href);
                    url.searchParams.delete('post');
                    window.history.replaceState({}, '', url.toString());
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Load More Indicator (for future pagination) */}
        {!loading && filteredPosts.length >= 10 && (
          <div className="text-center py-8">
            <p className="text-text-muted-light dark:text-text-muted-dark text-sm">
              You've reached the end! 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
};