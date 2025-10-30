
import React from 'react';
import { Post } from '../../types';
import { Avatar } from '../ui/Avatar';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <Avatar src={post.authorPhotoURL} alt={post.authorName} size="md" />
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.authorName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{post.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
        <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
      </div>
      {post.mediaURL && post.mediaType === 'image' && (
        <img className="w-full h-auto" src={post.mediaURL} alt="Post media" />
      )}
       {post.mediaURL && post.mediaType === 'video' && (
        <video className="w-full h-auto" controls src={post.mediaURL} />
      )}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-around text-gray-500 dark:text-gray-400">
        <button className="flex items-center space-x-2 hover:text-saffron transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5.5 8m7 2H5" /></svg>
          <span className="text-sm">Like</span>
        </button>
         <button className="flex items-center space-x-2 hover:text-saffron transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="text-sm">Comment</span>
        </button>
         <button className="flex items-center space-x-2 hover:text-saffron transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
          <span className="text-sm">Share</span>
        </button>
      </div>
    </div>
  );
};
