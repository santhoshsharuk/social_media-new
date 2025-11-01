// Helper function to get the correct asset path for both development and production
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Get base path from current location pathname
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  
  // Check if we have a base path (like /social_media-new/)
  // This works for both github.io and custom domains pointing to github pages
  if (pathParts.length > 0) {
    // Check if the first path segment looks like a repo name
    // or if pathname contains /social_media-new/
    const firstSegment = pathParts[0];
    
    // For custom domain with /social_media-new/ or github.io
    if (window.location.pathname.includes('/social_media-new/') || 
        (window.location.hostname.includes('github.io') && firstSegment === 'social_media-new')) {
      return `/social_media-new/${cleanPath}`;
    }
  }
  
  // Development mode (localhost)
  return `/${cleanPath}`;
};
