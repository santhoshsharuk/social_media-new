
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthToggle } from '../../views/AuthView';
import { router } from '../../utils/router';

export const SignUp: React.FC = () => {
  const { signup } = useAuth();
  const { toggleAuth, isFlipping } = useAuthToggle();
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
      <div className="absolute top-10 left-10 w-32 h-32 bg-saffron/10 rounded-3xl transform rotate-12 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-saffron/10 rounded-3xl transform -rotate-12 animate-pulse"></div>
      
      {/* Animated Sparkles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-saffron rounded-full animate-ping"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-saffron rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/5 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
      <div className="absolute bottom-1/3 right-1/5 w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
      <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
      <div className="absolute top-1/5 right-2/3 w-1 h-1 bg-saffron rounded-full animate-pulse" style={{ animationDelay: '1.7s' }}></div>
      
      {/* Floating Sparkles with custom animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-sparkle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes flip {
          0% { transform: rotateY(0deg) translateX(0); }
          10% { transform: rotateY(36deg) translateX(-3px); }
          20% { transform: rotateY(72deg) translateX(3px); }
          30% { transform: rotateY(108deg) translateX(-2px); }
          40% { transform: rotateY(144deg) translateX(2px); }
          50% { transform: rotateY(180deg) translateX(0); }
          60% { transform: rotateY(216deg) translateX(-2px); }
          70% { transform: rotateY(252deg) translateX(2px); }
          80% { transform: rotateY(288deg) translateX(-3px); }
          90% { transform: rotateY(324deg) translateX(3px); }
          100% { transform: rotateY(360deg) translateX(0); }
        }
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(1deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(-1deg); }
        }
        .sparkle-float { animation: float-sparkle 3s ease-in-out infinite; }
        .sparkle-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .image-float { animation: gentle-float 4s ease-in-out infinite; }
      `}} />
      
      <div className="absolute top-1/6 left-1/6 w-3 h-3 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full sparkle-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-1/2 right-1/6 w-2 h-2 bg-gradient-to-br from-yellow-300 to-saffron rounded-full sparkle-twinkle" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-1/6 left-2/3 w-2.5 h-2.5 bg-gradient-to-br from-orange-200 to-saffron rounded-full sparkle-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full sparkle-twinkle" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Illustration Side */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="relative">
            <img 
              src="/assets/loginpage.png" 
              alt="SignUp Illustration" 
              className={`w-full h-auto max-w-lg object-contain drop-shadow-2xl transition-transform duration-700 ${
                isFlipping ? 'animate-[flip_0.7s_ease-in-out]' : 'image-float'
              }`}
              style={{
                transformStyle: 'preserve-3d'
              }}
            />
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
            Already have an account? <button type="button" onClick={() => { toggleAuth(); router.push('/login'); }} className="text-saffron font-semibold hover:text-saffron-dark transition-colors">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
};
