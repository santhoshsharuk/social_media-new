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

export const router = {
  /**
   * Navigate to a route
   */
  push: (route: Route) => {
    window.history.pushState({}, '', route);
    window.dispatchEvent(new PopStateEvent('popstate'));
  },

  /**
   * Replace current route
   */
  replace: (route: Route) => {
    window.history.replaceState({}, '', route);
    window.dispatchEvent(new PopStateEvent('popstate'));
  },

  /**
   * Get current route
   */
  getCurrentRoute: (): string => {
    return window.location.pathname;
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
