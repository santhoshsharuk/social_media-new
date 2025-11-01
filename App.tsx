
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { User, Page } from './types';
import { AuthView } from './views/AuthView';
import { MainView } from './views/MainView';
import { auth, api, formatUser } from './services/firebase';
// FIX: Removed incorrect import for onAuthStateChanged as it is not available in the Firebase v8 API.
import { Spinner } from './components/ui/Spinner';
import { router } from './utils/router';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('feed');
  const [currentRoute, setCurrentRoute] = useState(router.getCurrentRoute());

  // Handle routing
  useEffect(() => {
    const handleRouteChange = () => {
      const route = router.getCurrentRoute();
      setCurrentRoute(route);
      
      // Map routes to pages
      switch (route) {
        case '/feed':
          setCurrentPage('feed');
          break;
        case '/profile':
          setCurrentPage('profile');
          break;
        case '/users':
          setCurrentPage('users');
          break;
        case '/admin':
          setCurrentPage('admin');
          break;
        case '/settings':
          setCurrentPage('settings');
          break;
        default:
          if (user) {
            setCurrentPage('feed');
          }
      }
    };

    // Initial route check
    handleRouteChange();

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [user]);

  useEffect(() => {
    // FIX: Switched to Firebase v8 namespaced API for onAuthStateChanged.
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const appUser = await formatUser(firebaseUser);
          setUser(appUser);
          // Redirect to feed if on auth pages
          const route = router.getCurrentRoute();
          if (route === '/' || route === '/login' || route === '/signup') {
            router.replace('/feed');
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null); // Fallback on error
        }
      } else {
        setUser(null);
        // Redirect to login if not authenticated
        const route = router.getCurrentRoute();
        if (route !== '/login' && route !== '/signup' && route !== '/') {
          router.replace('/login');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string): Promise<User> => {
    const loggedInUser = await api.login(email, password);
    setUser(loggedInUser);
    router.push('/feed');
    return loggedInUser;
  };

  const loginWithGoogle = async (): Promise<User> => {
    const loggedInUser = await api.loginWithGoogle();
    setUser(loggedInUser);
    router.push('/feed');
    return loggedInUser;
  };

  const signup = async (name: string, email: string, password?: string): Promise<User> => {
    const newUser = await api.signup(name, email, password);
    setUser(newUser);
    router.push('/feed');
    return newUser;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setCurrentPage('feed');
    router.push('/login');
  };
  
  const updateUserState = (updates: Partial<User>) => {
      if(user) {
          setUser({...user, ...updates});
      }
  }

  const follow = useCallback((adminId: string) => {
      if(!user) return;
      api.follow(user.id, adminId);
      updateUserState({ following: [...user.following, adminId]});
  }, [user]);

  const unfollow = useCallback((adminId: string) => {
      if(!user) return;
      api.unfollow(user.id, adminId);
      updateUserState({ following: user.following.filter(id => id !== adminId) });
  }, [user]);

  const updateProfile = async (updates: { name?: string; bio?: string; photoURL?: string }) => {
    if (!user) return;
    await api.updateUserProfile(user.id, updates);
    updateUserState(updates);
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-orange-600/10 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mb-6 animate-bounce">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto">
              <span className="material-symbols-outlined text-white text-4xl">rocket_launch</span>
            </div>
          </div>
          <Spinner />
          <h2 className="text-2xl font-bold text-primary mt-6 mb-2">Productive Bharat</h2>
          <p className="text-text-muted-light dark:text-text-muted-dark animate-pulse">Loading your experience...</p>
        </div>
      </div>
    );
  }

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    // Map pages to routes
    const routeMap: Record<Page, string> = {
      feed: '/feed',
      profile: '/profile',
      users: '/users',
      admin: '/admin',
      settings: '/settings',
      chat: '/chat',
    };
    router.push(routeMap[page] as any);
  };

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, signup, follow, unfollow, updateProfile }}>
        <div className="App">
          {user ? (
            <MainView currentPage={currentPage} setCurrentPage={handlePageChange} />
          ) : (
            <AuthView currentRoute={currentRoute} />
          )}
        </div>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
