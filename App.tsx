
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { User, Page } from './types';
import { AuthView } from './views/AuthView';
import { MainView } from './views/MainView';
import { auth, api, formatUser } from './services/firebase';
// FIX: Removed incorrect import for onAuthStateChanged as it is not available in the Firebase v8 API.
import { Spinner } from './components/ui/Spinner';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('feed');

  useEffect(() => {
    // FIX: Switched to Firebase v8 namespaced API for onAuthStateChanged.
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const appUser = await formatUser(firebaseUser);
          setUser(appUser);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null); // Fallback on error
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string): Promise<User> => {
    const loggedInUser = await api.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const loginWithGoogle = async (): Promise<User> => {
    const loggedInUser = await api.loginWithGoogle();
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (name: string, email: string, password?: string): Promise<User> => {
    const newUser = await api.signup(name, email, password);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setCurrentPage('feed');
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

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, signup, follow, unfollow, updateProfile }}>
        <div className="App">
          {user ? (
            <MainView currentPage={currentPage} setCurrentPage={setCurrentPage} />
          ) : (
            <AuthView />
          )}
        </div>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
