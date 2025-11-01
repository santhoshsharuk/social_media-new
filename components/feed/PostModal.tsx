import React, { useState, useEffect } from 'react';
import { Post, Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/firebase';
import { getMediumImageUrl } from '../../services/cloudinary';
import { Avatar } from '../ui/Avatar';
import { ShareModal } from './ShareModal';

interface PostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updatedPost: Post) => void;
}

export const PostModal: React.FC<PostModalProps> = ({ post, isOpen, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user.id) : false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadComments();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const fetchedComments = await api.getComments(post.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    
    try {
      await api.toggleLike(post.id, user.id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      
      if (onUpdate) {
        onUpdate({
          ...post,
          likes: isLiked ? post.likes.filter(id => id !== user.id) : [...post.likes, user.id],
          likesCount: isLiked ? likesCount - 1 : likesCount + 1,
        });
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      const newComment = await api.addComment(post.id, commentText);
      setComments([...comments, newComment]);
      setCommentText('');
      
      if (onUpdate) {
        onUpdate({
          ...post,
          commentsCount: post.commentsCount + 1,
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async () => {
    try {
      await api.incrementShareCount(post.id);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  // Parse carousel data
  let carouselData: { urls: string[]; aspectRatios: string[] } | null = null;
  if (post.mediaURL) {
    try {
      const parsed = JSON.parse(post.mediaURL);
      if (parsed.urls && Array.isArray(parsed.urls)) {
        carouselData = parsed;
      }
    } catch (e) {
      // Single image, not carousel
    }
  }

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '1:1': return 'aspect-square';
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
      default: return 'aspect-auto';
    }
  };

  const handlePrevSlide = () => {
    if (carouselData) {
      setCurrentSlide((prev) => (prev === 0 ? carouselData!.urls.length - 1 : prev - 1));
    }
  };

  const handleNextSlide = () => {
    if (carouselData) {
      setCurrentSlide((prev) => (prev === carouselData!.urls.length - 1 ? 0 : prev + 1));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Modal Content */}
      <div className="w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row bg-background-light dark:bg-surface-dark md:my-8 md:rounded-2xl overflow-hidden">
        
        {/* Left side - Media */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          {carouselData ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={getMediumImageUrl(carouselData.urls[currentSlide])}
                alt={`Slide ${currentSlide + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Navigation Arrows */}
              {carouselData.urls.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                  
                  {/* Dots indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {carouselData.urls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : post.mediaURL ? (
            <img
              src={getMediumImageUrl(post.mediaURL)}
              alt="Post media"
              className="max-w-full max-h-full object-contain"
            />
          ) : null}
        </div>

        {/* Right side - Details & Comments */}
        <div className="w-full md:w-[400px] flex flex-col bg-background-light dark:bg-surface-dark">
          {/* Header */}
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3">
              <Avatar src={post.authorPhotoURL} alt={post.authorName} size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-text-light dark:text-text-dark text-base font-bold">{post.authorName}</p>
                  <span className="material-symbols-outlined text-primary text-sm">verified</span>
                </div>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <p className="text-text-light dark:text-text-dark text-sm leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Actions */}
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isLiked
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted-light dark:text-text-muted-dark'
                }`}
              >
                <span className="material-symbols-outlined">thumb_up</span>
                <span className="text-sm font-semibold">{likesCount}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted-light dark:text-text-muted-dark transition-all">
                <span className="material-symbols-outlined">chat_bubble</span>
                <span className="text-sm font-semibold">{comments.length}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted-light dark:text-text-muted-dark transition-all"
              >
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto p-4">
            {loadingComments ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-sm text-text-muted-light dark:text-text-muted-dark py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar src={comment.authorPhotoURL} alt={comment.authorName} size="sm" />
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                        <p className="text-sm font-bold text-text-light dark:text-text-dark">
                          {comment.authorName}
                        </p>
                        <p className="text-sm text-text-light dark:text-text-dark mt-1">
                          {comment.text}
                        </p>
                      </div>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1 ml-4">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Comment Form */}
          {user && (
            <div className="p-4 border-t border-border-light dark:border-border-dark">
              <form onSubmit={handleAddComment} className="flex gap-3">
                <Avatar src={user.photoURL} alt={user.name} size="sm" />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-text-light dark:text-text-dark rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Post
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        post={post}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};
