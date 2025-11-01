// Helper function to get the correct asset path for both development and production
export const getAssetPath = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `/${cleanPath}`;
  }
  
  // For production with subdirectory (custom domain or github.io)
  return `/social_media-new/${cleanPath}`;
};
