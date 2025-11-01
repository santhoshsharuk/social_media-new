# 🔧 Firebase Storage CORS Error - Complete Fix Guide

## ✅ **Step 1: Fixed Storage Bucket URL**

I've already updated `firebaseConfig.ts`:
- Changed from: `socialmedia-295db.firebasestorage.app`  
- Changed to: `socialmedia-295db.appspot.com` ✅

---

## ✅ **Step 2: Configure Firebase Storage Rules**

### Go to Firebase Console:
1. Visit: https://console.firebase.google.com/project/socialmedia-295db/storage
2. Click on **Rules** tab
3. Replace the rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload files
    match /uploads/{allPaths=**} {
      // Allow read access to all
      allow read: if true;
      
      // Allow write access only to authenticated users
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');  // Only images
    }
    
    // Deny all other paths by default
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click **Publish**

---

## ✅ **Step 3: Set Up CORS Configuration (If needed)**

If the error persists, you need to configure CORS on the Storage bucket:

### Method 1: Using Google Cloud Console
1. Go to: https://console.cloud.google.com/storage/browser
2. Select project: **socialmedia-295db**
3. Click on the bucket: **socialmedia-295db.appspot.com**
4. Click **Permissions** tab
5. Click **Add Principal**
   - Principal: `allUsers`
   - Role: `Storage Object Viewer`
6. Click **Save**

### Method 2: Using gsutil (Command Line)
Create a file named `cors.json`:
```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:5173", "https://yourdomain.com"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]
```

Then run:
```bash
gsutil cors set cors.json gs://socialmedia-295db.appspot.com
```

---

## 🧪 **Testing the Fix**

1. Restart your dev server:
   ```powershell
   npm run dev
   ```

2. Try uploading an image in your app

3. Check the browser console - the CORS error should be gone

---

## 🔍 **Common Issues & Solutions**

### Error: "Storage bucket not configured"
- Make sure Firebase Storage is enabled in Firebase Console
- Go to: Firebase Console → Storage → Get Started

### Error: "Permission denied"
- Check your Storage Rules (see Step 2)
- Make sure user is authenticated before uploading

### Error: Still getting CORS
- Wait 5-10 minutes for rules to propagate
- Clear browser cache (Ctrl + Shift + Delete)
- Try incognito mode

---

## 📊 **Firebase Storage Limits (Free Tier)**

- **Storage:** 5 GB
- **Downloads:** 1 GB/day
- **Uploads:** 20k/day
- **File size limit:** 5 MB (configurable in rules)

**Note:** These limits are usually sufficient for development and small apps.

---

## 🎯 **Next Steps**

1. ✅ Storage bucket URL fixed
2. ⏳ Configure Storage Rules in Firebase Console
3. ⏳ Test image upload
4. ⏳ (Optional) Set up CORS if needed

**Your app should now be able to upload images!** 🚀

---

## Need Alternative? See CLOUDINARY_SETUP.md
If Firebase Storage still doesn't work or you prefer a more generous free tier, check out the Cloudinary setup guide.
