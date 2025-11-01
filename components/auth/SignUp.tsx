
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthToggle } from '../../views/AuthView';

export const SignUp: React.FC = () => {
  const { signup } = useAuth();
  const { toggleAuth } = useAuthToggle();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      // App component will handle navigation
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-saffron/10 rounded-3xl transform rotate-12"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-saffron/10 rounded-3xl transform -rotate-12"></div>
      <div className="absolute top-1/3 right-10 w-2 h-2 bg-saffron rounded-full"></div>
      <div className="absolute bottom-1/3 left-20 w-2 h-2 bg-saffron rounded-full"></div>
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Illustration Side */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-80 h-80 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 400 400" className="w-full h-full">
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
          <h2 className="mt-8 text-3xl font-bold text-gray-800 dark:text-white">Join Us Today!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Create your account to get started</p>
        </div>

        {/* SignUp Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter your details to create your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input
                id="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <input
                id="email-signup"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <input
                id="password-signup"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-saffron to-saffron-dark hover:from-saffron-dark hover:to-saffron text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account? <button type="button" onClick={toggleAuth} className="text-saffron font-semibold hover:text-saffron-dark transition-colors">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
};
