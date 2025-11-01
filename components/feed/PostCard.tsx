import React, { useState, useEffect } from 'react';
import { Post, Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/firebase';
import { getMediumImageUrl } from '../../services/cloudinary';
import { PostModal } from './PostModal';
import { ShareModal } from './ShareModal';

// Material Symbols Icons as React Components
const ThumbUpIcon = () => <span className="material-symbols-outlined text-xl">thumb_up</span>;
const ChatBubbleIcon = () => <span className="material-symbols-outlined text-xl">chat_bubble</span>;
const ShareIcon = () => <span className="material-symbols-outlined text-xl">share</span>;
const VerifiedIcon = () => <span className="material-symbols-outlined text-green-700 dark:text-green-500 !text-[18px]">verified</span>;

interface PostCardProps {
  post: Post;
  onUpdate?: () => void;
  isOpenByDefault?: boolean;
  onModalClose?: () => void;
}

export const PostCard: React.FC<PostCardProps> = React.memo(({ post, onUpdate, isOpenByDefault = false, onModalClose }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user.id) : false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [sharesCount, setSharesCount] = useState(post.sharesCount);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(isOpenByDefault);
  const [showShareModal, setShowShareModal] = useState(false);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get('post');
      
      if (postId !== post.id && showModal) {
        setShowModal(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showModal, post.id]);

  const handleLike = async () => {
    if (!user) return;
    
    try {
      await api.toggleLike(post.id, user.id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    
    setLoadingComments(true);
    try {
      const fetchedComments = await api.getComments(post.id);
      setComments(fetchedComments);
      setShowComments(true);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      const newComment = await api.addComment(post.id, commentText);
      setComments([newComment, ...comments]);
      setCommentText('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async () => {
    try {
      await api.incrementShareCount(post.id);
      setSharesCount(sharesCount + 1);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    // Update URL with post ID
    const url = new URL(window.location.href);
    url.searchParams.set('post', post.id);
    window.history.pushState({}, '', url.toString());
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (onModalClose) {
      onModalClose();
    } else {
      // Remove post parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('post');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const optimizedImageUrl = post.mediaURL ? getMediumImageUrl(post.mediaURL) : post.mediaURL;
  
  // Parse carousel data if exists
  let carouselData: { urls: string[]; aspectRatios: ('1:1' | '16:9' | '9:16')[] } | null = null;
  try {
    if (post.mediaURL && post.mediaURL.startsWith('{')) {
      carouselData = JSON.parse(post.mediaURL);
    }
  } catch (e) {
    // Not carousel data, use single image
  }

  const getAspectRatioClass = (ratio: '1:1' | '16:9' | '9:16') => {
    switch (ratio) {
      case '1:1': return 'aspect-square';
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
    }
  };

  const handlePrevSlide = () => {
    if (!carouselData) return;
    setCurrentSlide(prev => prev === 0 ? carouselData.urls.length - 1 : prev - 1);
  };

  const handleNextSlide = () => {
    if (!carouselData) return;
    setCurrentSlide(prev => prev === carouselData.urls.length - 1 ? 0 : prev + 1);
  };
  
  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  return (
    <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-sm hover:shadow-md transition-shadow @container">
      <div className="flex flex-col items-stretch justify-start p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <img 
            className="h-10 w-10 rounded-full object-cover" 
            src={post.authorPhotoURL || 'https://via.placeholder.com/40'} 
            alt={post.authorName}
            loading="lazy"
          />
          <div className="flex items-center gap-1.5">
            <p className="text-text-light dark:text-text-dark text-base font-bold">{post.authorName}</p>
            {post.authorId === 'admin' && <VerifiedIcon />}
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal ml-auto">
            {getTimeAgo(post.createdAt)}
          </p>
        </div>

        {/* Media - Show before content if exists */}
        {post.mediaURL && post.mediaType === 'image' && (
          carouselData ? (
            // Carousel View
            <div className="relative w-full mb-4 rounded-lg overflow-hidden group">
              <div className="relative cursor-pointer" onClick={handleOpenModal}>
                <img
                  src={getMediumImageUrl(carouselData.urls[currentSlide])}
                  alt={`Slide ${currentSlide + 1}`}
                  className={`w-full object-cover ${getAspectRatioClass(carouselData.aspectRatios[currentSlide])}`}
                  loading="lazy"
                />
                {/* Full view indicator */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                    open_in_full
                  </span>
                </div>
                
                {/* Navigation Arrows */}
                {carouselData.urls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                      onClick={handleNextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </>
                )}
              </div>
              
              {/* Dots Indicator */}
              {carouselData.urls.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {carouselData.urls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'bg-white w-6' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Counter */}
              {carouselData.urls.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {currentSlide + 1} / {carouselData.urls.length}
                </div>
              )}
            </div>
          ) : (
            // Single Image View
            <div 
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg mb-4 cursor-pointer group relative overflow-hidden"
              onClick={handleOpenModal} 
              style={{ backgroundImage: `url("${optimizedImageUrl}")` }}
            >
              {/* Full view indicator */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                  open_in_full
                </span>
              </div>
            </div>
          )
        )}
        {post.mediaURL && post.mediaType === 'video' && !carouselData && (
          <div className="relative cursor-pointer group" onClick={handleOpenModal}>
            <video className="w-full rounded-lg mb-4" controls src={post.mediaURL} />
            <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">open_in_full</span>
              Full View
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2">
          <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Actions - Compact Instagram Style */}
        <div className="flex items-center gap-4 px-2 py-2">
          <button 
            onClick={handleLike}
            disabled={!user}
            className={`flex items-center gap-1 transition-all ${
              isLiked
                ? 'text-red-500'
                : 'text-text-light dark:text-text-dark hover:text-text-muted-light'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
              favorite
            </span>
            {likesCount > 0 && <span className="text-sm font-medium">{likesCount}</span>}
          </button>
          
          <button 
            onClick={loadComments}
            disabled={!user || loadingComments}
            className="flex items-center gap-1 text-text-light dark:text-text-dark hover:text-text-muted-light transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-2xl">chat_bubble</span>
            {post.commentsCount > 0 && <span className="text-sm font-medium">{post.commentsCount}</span>}
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center gap-1 text-text-light dark:text-text-dark hover:text-text-muted-light transition-all"
          >
            <span className="material-symbols-outlined text-2xl">send</span>
            {sharesCount > 0 && <span className="text-sm font-medium">{sharesCount}</span>}
          </button>
        </div>

        {/* Comments Section */}
        {showComments && user && (
          <div className="border-t border-border-light dark:border-border-dark mt-4 pt-4">
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex gap-3">
                <img 
                  className="h-8 w-8 rounded-full object-cover" 
                  src={user.photoURL || 'https://via.placeholder.com/32'} 
                  alt={user.name}
                  loading="lazy"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm text-text-light dark:text-text-dark"
                  />
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-center text-sm text-text-muted-light dark:text-text-muted-dark py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img 
                      className="h-8 w-8 rounded-full object-cover" 
                      src={comment.authorPhotoURL || 'https://via.placeholder.com/32'} 
                      alt={comment.authorName}
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className="bg-background-light dark:bg-background-dark rounded-lg px-4 py-2">
                        <p className="text-sm font-semibold text-text-light dark:text-text-dark">{comment.authorName}</p>
                        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{comment.text}</p>
                      </div>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1 ml-2">
                        {getTimeAgo(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full View Modal */}
      <PostModal
        post={post}
        isOpen={showModal}
        onClose={handleCloseModal}
        onUpdate={(updatedPost) => {
          if (onUpdate) {
            onUpdate();
          }
          // Update local state
          setLikesCount(updatedPost.likesCount);
          setIsLiked(user ? updatedPost.likes.includes(user.id) : false);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        post={post}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
});
