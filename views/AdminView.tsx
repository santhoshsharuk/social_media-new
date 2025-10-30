import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CreatePostForm } from '../components/feed/CreatePostForm';
import { api } from '../services/firebase';
import { Post } from '../types';

export const AdminView: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const fetchedPosts = await api.getPosts();
    // Show only posts created by the current admin
    setPosts(fetchedPosts.filter(p => p.authorId === user?.id));
  };
  
  useEffect(() => {
    if(user) {
        fetchPosts();
    }
  }, [user]);
  
  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }

  if (user?.role !== 'admin') {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Admin Dashboard</h1>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
        <CreatePostForm onPostCreated={handlePostCreated}/>
      </div>

       <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">My Recent Posts</h2>
        <div className="space-y-4">
            {posts.length > 0 ? posts.map(post => (
                <div key={post.id} className="border dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <p className="font-semibold truncate">{post.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{post.createdAt.toLocaleDateString()}</p>
                </div>
            )) : <p className="text-gray-500">You haven't created any posts yet.</p>}
        </div>
      </div>
    </div>
  );
};
