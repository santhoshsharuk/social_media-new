
import React, { useState } from 'react';
import { Login } from '../components/auth/Login';
import { SignUp } from '../components/auth/SignUp';

const FlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12" width="48" height="24">
        <rect width="24" height="4" fill="#FF9933" />
        <rect y="4" width="24" height="4" fill="#FFFFFF" />
        <rect y="8" width="24" height="4" fill="#138808" />
        <circle cx="12" cy="6" r="1.5" fill="#000080" />
    </svg>
);


export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <div className="text-center">
            <div className="flex justify-center mb-4">
               <FlagIcon />
            </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            to Productive Bharat 🇮🇳
          </p>
        </div>
        
        {isLogin ? <Login /> : <SignUp />}
        
        <div className="text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-saffron hover:text-saffron-dark">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};
