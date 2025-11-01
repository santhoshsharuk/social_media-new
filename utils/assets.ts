// Helper function to get the correct asset path for both development and production
export const getAssetPath = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // For custom domain, assets are at root
  return `/${cleanPath}`;
};
