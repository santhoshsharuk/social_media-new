
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/firebase';
import { Post } from '../../types';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

interface CreatePostFormProps {
  onPostCreated: (post: Post) => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(file.type.startsWith('image') ? 'image' : 'video');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    
    setLoading(true);
    setError('');

    try {
      let mediaURL: string | undefined = undefined;
      if (mediaFile) {
        mediaURL = await api.uploadFile(mediaFile);
      }

      const newPostData = {
        authorId: user.id,
        content,
        mediaURL,
        mediaType,
      };

      const createdPost = await api.createPost(newPostData);
      onPostCreated(createdPost);
      
      // Reset form
      setContent('');
      setMediaFile(null);
      setMediaType(undefined);
      if (document.getElementById('file-upload') as HTMLInputElement) {
        (document.getElementById('file-upload') as HTMLInputElement).value = '';
      }

    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`What's on your mind, ${user?.name}?`}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron dark:bg-gray-700 dark:border-gray-600"
        rows={4}
        required
      />
      <div className="flex justify-between items-center">
        <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*,video/*" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-saffron/10 file:text-saffron hover:file:bg-saffron/20" />
        <Button type="submit" disabled={loading} size="sm">
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </form>
  );
};
