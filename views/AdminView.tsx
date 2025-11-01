import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CreatePostForm } from '../components/feed/CreatePostForm';
import { api } from '../services/firebase';
import { Post } from '../types';

export const AdminView: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await api.getPosts();
      setAllPosts(fetchedPosts);
      // Show only posts created by the current admin
      setPosts(fetchedPosts.filter(p => p.authorId === user?.id));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if(user) {
        fetchPosts();
    }
  }, [user]);
  
  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setAllPosts(prevPosts => [newPost, ...prevPosts]);
  }

  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone, and all images will be removed from storage.');
    
    if (!confirmed) return;

    try {
      setDeletingPostId(postId);
      
      // Delete post from Firebase (includes comments)
      await api.deletePost(postId);
      
      // Note: Cloudinary images will remain but that's okay for free tier
      // In production, you'd call a backend API to delete from Cloudinary
      
      // Update local state
      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      setAllPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeletingPostId(null);
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center p-8 bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-border-light dark:border-border-dark max-w-md">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-red-600 dark:text-red-400">block</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">Access Denied</h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalPosts = allPosts.length;
  const myPosts = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.commentsCount || 0), 0);
  const totalShares = posts.reduce((sum, post) => sum + (post.sharesCount || 0), 0);
  const avgEngagement = myPosts > 0 ? Math.round((totalLikes + totalComments + totalShares) / myPosts) : 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl shadow-lg p-6 md:p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-5xl">admin_panel_settings</span>
              Admin Dashboard
            </h1>
            <p className="text-white/90 text-lg">Welcome back, {user?.name}!</p>
          </div>
          <div>
            <CreatePostForm onPostCreated={handlePostCreated} />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Posts */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">Total Posts</p>
              <h3 className="text-3xl font-bold text-text-light dark:text-text-dark mt-2">{totalPosts}</h3>
              <p className="text-xs text-primary mt-1">Platform-wide</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">article</span>
            </div>
          </div>
        </div>

        {/* My Posts */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">My Posts</p>
              <h3 className="text-3xl font-bold text-text-light dark:text-text-dark mt-2">{myPosts}</h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Your content</p>
            </div>
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">edit_note</span>
            </div>
          </div>
        </div>

        {/* Total Engagement */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">Total Engagement</p>
              <h3 className="text-3xl font-bold text-text-light dark:text-text-dark mt-2">{totalLikes + totalComments + totalShares}</h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{totalLikes} likes, {totalComments} comments</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-purple-600 dark:text-purple-400">favorite</span>
            </div>
          </div>
        </div>

        {/* Avg Engagement */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-md border border-border-light dark:border-border-dark p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">Avg per Post</p>
              <h3 className="text-3xl font-bold text-text-light dark:text-text-dark mt-2">{avgEngagement}</h3>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Interactions</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-orange-600 dark:text-orange-400">trending_up</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-primary/5 to-orange-600/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-primary">history</span>
              <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">My Recent Posts</h2>
            </div>
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {myPosts} Posts
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
              <p className="text-text-muted-light dark:text-text-muted-dark mt-4">Loading your posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <div 
                  key={post.id} 
                  className="border border-border-light dark:border-border-dark rounded-xl p-5 bg-background-light dark:bg-gray-800/50 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={post.authorPhotoURL} 
                      alt={post.authorName}
                      className="w-12 h-12 rounded-full border-2 border-primary"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-text-light dark:text-text-dark">{post.authorName}</p>
                          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            {post.createdAt.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          disabled={deletingPostId === post.id}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-md"
                          title="Delete post"
                        >
                          {deletingPostId === post.id ? (
                            <>
                              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">delete</span>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                      
                      <p className="text-text-light dark:text-text-dark mb-3 line-clamp-3">{post.content}</p>
                      
                      {/* Media Display - Support both single image and carousel */}
                      {post.mediaURL && (
                        <div className="mb-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {post.mediaType === 'video' ? (
                            <video src={post.mediaURL} controls className="w-full max-h-96 object-cover" />
                          ) : (() => {
                            // Try to parse as carousel data
                            try {
                              const carouselData = JSON.parse(post.mediaURL);
                              if (carouselData.urls && Array.isArray(carouselData.urls) && carouselData.urls.length > 0) {
                                const aspectRatios = carouselData.aspectRatios || [];
                                const getAspectRatioClass = (ratio: string) => {
                                  switch (ratio) {
                                    case '16:9': return 'aspect-video';
                                    case '9:16': return 'aspect-[9/16]';
                                    case '1:1':
                                    default: return 'aspect-square';
                                  }
                                };
                                
                                return (
                                  <div className="grid grid-cols-2 gap-2">
                                    {carouselData.urls.slice(0, 4).map((url: string, idx: number) => (
                                      <div key={idx} className="relative">
                                        <img 
                                          src={url} 
                                          alt={`Media ${idx + 1}`}
                                          className={`w-full object-cover ${getAspectRatioClass(aspectRatios[idx] || '1:1')}`}
                                        />
                                        {idx === 3 && carouselData.urls.length > 4 && (
                                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold">+{carouselData.urls.length - 4}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                            } catch {
                              // Not JSON, treat as single image URL
                            }
                            
                            // Single image fallback
                            return <img src={post.mediaURL} alt="Post media" className="w-full max-h-96 object-cover" />;
                          })()}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1 text-text-muted-light dark:text-text-muted-dark">
                          <span className="material-symbols-outlined text-lg text-red-500">favorite</span>
                          <span className="font-medium">{post.likesCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-text-muted-light dark:text-text-muted-dark">
                          <span className="material-symbols-outlined text-lg text-blue-500">chat_bubble</span>
                          <span className="font-medium">{post.commentsCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 text-text-muted-light dark:text-text-muted-dark">
                          <span className="material-symbols-outlined text-lg text-green-500">send</span>
                          <span className="font-medium">{post.sharesCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-text-muted-light dark:text-text-muted-dark">post_add</span>
              </div>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-2">No posts yet</h3>
              <p className="text-text-muted-light dark:text-text-muted-dark mb-6 text-center max-w-md">
                You haven't created any posts yet. Start sharing your thoughts with the community!
              </p>
              <div>
                <CreatePostForm onPostCreated={handlePostCreated} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
