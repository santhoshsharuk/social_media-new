// Helper function to get the correct asset path for both development and production
// Vite automatically handles base path transformation during build
export const getAssetPath = (path: string): string => {
  // In Vite, import.meta.env.BASE_URL provides the base path
  // But since we're using CDN imports, we'll use a simpler approach
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Check if we're on GitHub Pages
  if (window.location.hostname.includes('github.io')) {
    return `/social_media-new/${cleanPath}`;
  }
  
  // Development mode
  return `/${cleanPath}`;
};
