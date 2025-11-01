/**
 * Admin Role Setup Script
 * 
 * This script helps you set a user's role to 'admin' in Firestore.
 * 
 * Usage:
 * 1. Update the USER_EMAIL constant below with your email
 * 2. Run: npm run dev (make sure Firebase is initialized)
 * 3. Open browser console and run this script
 * 
 * Alternative: Use Firebase Console to manually update the role field
 */

import { auth, db } from '../services/firebase';

// ⚠️ UPDATE THIS with your email address
const USER_EMAIL = 'your-email@example.com'; // Change this to your email

/**
 * Sets admin role for a user by email
 */
export async function setUserAsAdmin(email: string): Promise<void> {
  try {
    // Get current user
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('❌ No user is currently logged in. Please login first.');
      return;
    }

    if (currentUser.email !== email) {
      console.warn(`⚠️ Currently logged in as: ${currentUser.email}`);
      console.warn(`⚠️ Attempting to update: ${email}`);
      console.warn(`⚠️ Please make sure you're logged in with the correct account.`);
    }

    // Update the user's role in Firestore
    const userRef = db.collection('users').doc(currentUser.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error('❌ User document not found in Firestore');
      return;
    }

    await userRef.update({
      role: 'admin'
    });

    console.log('✅ SUCCESS! User role updated to admin');
    console.log('👤 User ID:', currentUser.uid);
    console.log('📧 Email:', currentUser.email);
    console.log('🔄 Please refresh the page or logout/login to see changes');

  } catch (error) {
    console.error('❌ Error setting admin role:', error);
    throw error;
  }
}

/**
 * Quick function to run in browser console
 */
export async function makeCurrentUserAdmin(): Promise<void> {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('❌ No user logged in!');
      return;
    }

    const userRef = db.collection('users').doc(currentUser.uid);
    await userRef.update({ role: 'admin' });

    console.log('✅ You are now an admin!');
    console.log('🔄 Refreshing page in 2 seconds...');
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// If you want to run this automatically when importing
if (typeof window !== 'undefined') {
  // @ts-ignore - Make function available in browser console
  window.makeCurrentUserAdmin = makeCurrentUserAdmin;
  console.log('🔧 Admin setup loaded. Run: makeCurrentUserAdmin()');
}
