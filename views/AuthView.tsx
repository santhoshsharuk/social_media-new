
import React, { useState, createContext, useContext } from 'react';
import { Login } from '../components/auth/Login';
import { SignUp } from '../components/auth/SignUp';

const AuthToggleContext = createContext<{
  isLogin: boolean;
  toggleAuth: () => void;
}>({ isLogin: true, toggleAuth: () => {} });

export const useAuthToggle = () => useContext(AuthToggleContext);

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuth = () => setIsLogin(!isLogin);

  return (
    <AuthToggleContext.Provider value={{ isLogin, toggleAuth }}>
      {isLogin ? <Login /> : <SignUp />}
    </AuthToggleContext.Provider>
  );
};
