
import React, { useState, createContext, useContext } from 'react';
import { Login } from '../components/auth/Login';
import { SignUp } from '../components/auth/SignUp';

const AuthToggleContext = createContext<{
  isLogin: boolean;
  isFlipping: boolean;
  toggleAuth: () => void;
}>({ isLogin: true, isFlipping: false, toggleAuth: () => {} });

export const useAuthToggle = () => useContext(AuthToggleContext);

interface AuthViewProps {
  currentRoute?: string;
}

export const AuthView: React.FC<AuthViewProps> = ({ currentRoute = '/login' }) => {
  const [isLogin, setIsLogin] = useState(currentRoute !== '/signup');
  const [isFlipping, setIsFlipping] = useState(false);

  const toggleAuth = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setTimeout(() => {
        setIsFlipping(false);
      }, 100);
    }, 350);
  };

  return (
    <AuthToggleContext.Provider value={{ isLogin, isFlipping, toggleAuth }}>
      {isLogin ? <Login /> : <SignUp />}
    </AuthToggleContext.Provider>
  );
};
