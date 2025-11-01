// Simple client-side router
export type Route = 
  | '/login'
  | '/signup'
  | '/feed'
  | '/profile'
  | '/users'
  | '/admin'
  | '/settings'
  | '/';

// Get the base path from the URL
const getBasePath = (): string => {
  // For custom domain, use root path
  return '';
};

// Build full path with base
const buildPath = (route: Route): string => {
  const basePath = getBasePath();
  return basePath + route;
};

// Get route without base path
const getRouteFromPath = (pathname: string): string => {
  const basePath = getBasePath();
  if (basePath && pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length) || '/';
  }
  return pathname;
};

export const router = {
  /**
   * Navigate to a route
   */
  push: (route: Route) => {
    const fullPath = buildPath(route);
    window.history.pushState({}, '', fullPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  },

  /**
   * Replace current route
   */
  replace: (route: Route) => {
    const fullPath = buildPath(route);
    window.history.replaceState({}, '', fullPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  },

  /**
   * Get current route (without base path)
   */
  getCurrentRoute: (): string => {
    return getRouteFromPath(window.location.pathname);
  },

  /**
   * Go back
   */
  back: () => {
    window.history.back();
  },
};

/**
 * Hook to use router in components
 */
export const useRouter = (onRouteChange: (route: string) => void) => {
  const handleRouteChange = () => {
    onRouteChange(router.getCurrentRoute());
  };

  // Listen for route changes
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }
};
