import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthToggle } from '../../views/AuthView';

export const Login: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const { toggleAuth } = useAuthToggle();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // App component will handle navigation
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      // App component will handle navigation
    } catch (err: any) {
      setError(err.message || 'Failed to log in with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-saffron/10 rounded-3xl transform rotate-12"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-saffron/10 rounded-3xl transform -rotate-12"></div>
      <div className="absolute top-1/3 right-10 w-2 h-2 bg-saffron rounded-full"></div>
      <div className="absolute bottom-1/3 left-20 w-2 h-2 bg-saffron rounded-full"></div>
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-saffron rounded-full"></div>
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Illustration Side */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="relative">
            {/* Illustration Placeholder - You can replace with actual SVG */}
            <div className="w-80 h-80 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Person sitting with laptop */}
                  <circle cx="200" cy="120" r="40" fill="#FF9933" opacity="0.2"/>
                  <path d="M200 160 L200 240" stroke="#FF9933" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M200 180 L160 220" stroke="#FF9933" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M200 180 L240 220" stroke="#FF9933" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M200 240 L160 300" stroke="#FF9933" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M200 240 L240 300" stroke="#FF9933" strokeWidth="4" strokeLinecap="round"/>
                  <rect x="140" y="250" width="120" height="80" rx="8" fill="#FFE5CC"/>
                  <rect x="150" y="260" width="100" height="60" rx="4" fill="#fff"/>
                  <line x1="170" y1="280" x2="210" y2="280" stroke="#FF9933" strokeWidth="2"/>
                  <line x1="170" y1="295" x2="230" y2="295" stroke="#FFB366" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-4 -left-4 grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-saffron rounded-full"></div>
              ))}
            </div>
            <div className="absolute -bottom-4 -right-4 grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-saffron rounded-full"></div>
              ))}
            </div>
          </div>
          <h2 className="mt-8 text-3xl font-bold text-gray-800 dark:text-white">Welcome Back!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to continue your journey</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Agent Login</h1>
            <p className="text-gray-600 dark:text-gray-400">Hey, Enter your details to get sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input
                id="email"
                type="email"
                placeholder="Enter Email / Phone No"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all"
              />
            </div>
            
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-medium"
              >
                Hide
              </button>
            </div>

            <div className="text-left">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-saffron transition-colors">
                Having trouble in sign in?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-saffron to-saffron-dark hover:from-saffron-dark hover:to-saffron text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]" 
              disabled={loading || googleLoading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or Sign in with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
            </button>
            
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Apple ID</span>
            </button>
            
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all transform hover:scale-105"
            >
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? <button type="button" onClick={toggleAuth} className="text-saffron font-semibold hover:text-saffron-dark transition-colors">Request Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};
