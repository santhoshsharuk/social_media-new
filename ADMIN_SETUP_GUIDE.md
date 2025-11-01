# 🔐 Admin Role Setup Guide

## Quick Method (Using the App UI)

I've added a temporary **AdminSetup** component to your app. Follow these steps:

### Steps:
1. **Login to your account** with your credentials
2. Look for a **floating box** in the bottom-right corner of the screen
3. Click the **"🔐 Make Me Admin"** button
4. Wait 2 seconds - the page will automatically refresh
5. **You're now an admin!** You should see the "Admin" menu option

### After Setup:
**Remove the AdminSetup component** to clean up your code:

1. Open `App.tsx`
2. Remove this line:
   ```typescript
   import { AdminSetup } from './components/admin/AdminSetup';
   ```
3. Remove this section:
   ```typescript
   {/* Temporary component to set admin role - Remove after setup */}
   <AdminSetup />
   ```

---

## Alternative Method 1: Firebase Console (Manual)

If you prefer to do it manually:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **socialmedia-295db**
3. Navigate to **Firestore Database**
4. Click on **users** collection
5. Find your user document (your UID)
6. Edit the **role** field from `user` to `admin`
7. Click **Update**
8. Logout and login to your app

---

## Alternative Method 2: Browser Console

1. Login to your app
2. Open **Browser DevTools** (Press F12)
3. Go to **Console** tab
4. Paste this code:
   ```javascript
   const db = firebase.firestore();
   const auth = firebase.auth();
   const userRef = db.collection('users').doc(auth.currentUser.uid);
   userRef.update({ role: 'admin' }).then(() => {
     console.log('✅ You are now an admin!');
     setTimeout(() => window.location.reload(), 2000);
   });
   ```
5. Press **Enter**
6. Page will refresh automatically

---

## Verifying Admin Access

After becoming an admin, you should see:

✅ **"Admin"** menu item in the sidebar (desktop)  
✅ **Admin Dashboard** page with post creation form  
✅ Settings icon in bottom navigation (mobile)  
✅ Ability to create posts that all users can see  

---

## Creating More Admins

To make other users admins:

### Option 1: Firebase Console
- Follow Alternative Method 1 above for each user

### Option 2: Using Firestore Rules (Recommended for Production)
Create an admin management page where existing admins can promote users.

---

## Security Note ⚠️

**Important:** In production, you should:

1. **Add Firestore Security Rules** to prevent users from changing their own roles
2. **Create an admin management system** where only existing admins can promote users
3. **Remove client-side role updates** and use Cloud Functions instead

Example Firestore Rule:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Only allow reading own profile or if user is admin
      allow read: if request.auth.uid == userId;
      
      // Prevent users from changing their own role
      allow update: if request.auth.uid == userId && 
                      !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']);
    }
  }
}
```

---

## Troubleshooting

### "Admin menu not showing"
- Make sure you logged out and logged back in
- Check browser console for errors
- Verify role is "admin" in Firestore

### "Permission denied error"
- Check your Firestore rules
- Make sure you're logged in
- Verify Firebase connection

### "Component not visible"
- Make sure you're logged in
- Check if AdminSetup component is imported in App.tsx
- Look in bottom-right corner of the screen

---

## Need Help?

Check the Firebase Console to verify:
- User exists in `users` collection
- `role` field is set to `"admin"` (string value)
- Firebase Auth shows your user is authenticated

---

**Project:** Productive Bharat Social Media  
**Last Updated:** October 30, 2025
