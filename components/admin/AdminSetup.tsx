import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { Button } from '../ui/Button';

/**
 * AdminSetup Component
 * 
 * Temporary component to set your account as admin.
 * Remove this component after setting up your admin account.
 */
export const AdminSetup: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const makeAdmin = async () => {
    if (!user) {
      setMessage('❌ Please login first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Update role in Firestore
      const userRef = db.collection('users').doc(user.id);
      await userRef.update({
        role: 'admin'
      });

      setMessage('✅ Success! You are now an admin. Refreshing page...');
      
      // Reload page to refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('Error setting admin role:', error);
      setMessage(`❌ Error: ${error.message}`);
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  // If already admin, show success message
  if (user.role === 'admin') {
    return (
      <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-lg">
        <h3 className="font-bold mb-2">✅ You are already an admin!</h3>
        <p className="text-sm">You can remove the AdminSetup component now.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border-2 border-saffron p-6 rounded-lg shadow-xl max-w-md">
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
        🔧 Admin Setup
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Current Role: <span className="font-semibold">{user.role}</span>
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Click the button below to set your account as admin.
      </p>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md text-sm ${
          message.includes('✅') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <Button
        onClick={makeAdmin}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Setting Admin Role...' : '🔐 Make Me Admin'}
      </Button>

      <p className="text-xs text-gray-500 mt-4 italic">
        ⚠️ Remove this component after setup
      </p>
    </div>
  );
};
