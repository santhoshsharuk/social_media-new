
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './contexts/AuthContext';
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


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, follow, unfollow }}>
      <div className="App">
        {user ? (
          <MainView currentPage={currentPage} setCurrentPage={setCurrentPage} />
        ) : (
          <AuthView />
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
