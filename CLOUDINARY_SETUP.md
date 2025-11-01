# ☁️ Cloudinary Setup Guide - Better Alternative to Firebase Storage

## Why Cloudinary?

✅ **25 GB** free storage + bandwidth (vs Firebase 5 GB)  
✅ **No billing** setup required  
✅ **Built-in image optimization** (resize, compress, format conversion)  
✅ **No CORS issues**  
✅ **CDN delivery** for fast loading  
✅ **Easy upload widget**  

---

## 🚀 **Step 1: Create Cloudinary Account**

1. Go to: https://cloudinary.com/users/register_free
2. Sign up with your email
3. Verify your email
4. Go to: https://console.cloudinary.com/

---

## 🔑 **Step 2: Get Your Credentials**

In the Cloudinary Dashboard, you'll see:

```
Cloud name: your_cloud_name
API Key: 123456789012345
API Secret: your_api_secret
```

📝 **Note these down!** You'll need them.

---

## 📦 **Step 3: Install Cloudinary SDK**

Run in your project directory:

```powershell
npm install cloudinary-react
```

---

## 🔧 **Step 4: Create Cloudinary Configuration**

Create a new file: `services/cloudinary.ts`

```typescript
// Cloudinary configuration and upload utility

export const CLOUDINARY_CONFIG = {
  cloudName: 'YOUR_CLOUD_NAME', // Replace with your cloud name
  uploadPreset: 'social_media_uploads', // We'll create this in Step 5
};

/**
 * Upload file to Cloudinary
 * @param file - File to upload
 * @returns URL of uploaded image
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

  try {
    const response = await fetch(
      \`https://api.cloudinary.com/v1_1/\${CLOUDINARY_CONFIG.cloudName}/image/upload\`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Returns direct HTTPS URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete file from Cloudinary
 * @param publicId - The public ID of the image (from URL)
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // Note: Deletion requires API Secret, so it's better done on backend
  // For frontend-only apps, just remove the reference from your database
  console.warn('Delete must be done via backend API with signature');
}

/**
 * Get optimized image URL
 * @param url - Original Cloudinary URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized URL
 */
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number
): string {
  if (!url.includes('cloudinary')) return url;
  
  const transformations = [];
  if (width) transformations.push(\`w_\${width}\`);
  if (height) transformations.push(\`h_\${height}\`);
  transformations.push('c_fill', 'q_auto', 'f_auto');
  
  const transformation = transformations.join(',');
  return url.replace('/upload/', \`/upload/\${transformation}/\`);
}
```

---

## 🔐 **Step 5: Create Upload Preset (Important!)**

1. Go to: https://console.cloudinary.com/settings/upload
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Settings:
   - **Preset name:** `social_media_uploads`
   - **Signing mode:** `Unsigned` (allows frontend uploads)
   - **Folder:** `social_media/posts` (organizes your files)
   - **Max file size:** 5 MB
   - **Allowed formats:** jpg, png, gif, webp
5. Click **Save**

---

## 🔄 **Step 6: Update Firebase Service**

Update `services/firebase.ts` to use Cloudinary instead:

```typescript
import { uploadToCloudinary } from './cloudinary';

const api = {
  // ... other methods ...

  // Replace uploadFile with Cloudinary version
  async uploadFile(file: File): Promise<string> {
    // Now uses Cloudinary instead of Firebase Storage
    return uploadToCloudinary(file);
  }
};
```

---

## 🎨 **Step 7: Update Configuration File**

Edit `services/cloudinary.ts` and replace:
```typescript
cloudName: 'YOUR_CLOUD_NAME', // Change this!
```

With your actual cloud name from the dashboard.

---

## ✅ **Step 8: Test Upload**

1. Restart your dev server:
   ```powershell
   npm run dev
   ```

2. Login to your app
3. Try uploading an image in a post
4. Check Cloudinary Dashboard → Media Library to see your upload

---

## 🖼️ **Using Optimized Images**

In your components, use optimized versions:

```typescript
import { getOptimizedImageUrl } from '../services/cloudinary';

// In your component:
const optimizedUrl = getOptimizedImageUrl(post.mediaURL, 800, 600);

<img src={optimizedUrl} alt="Post image" />
```

This automatically:
- Resizes to 800x600
- Compresses for web
- Converts to best format (WebP if supported)
- Serves from CDN

---

## 📊 **Cloudinary Free Tier Limits**

- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month
- **No credit card required!**

**Perfect for:**
- Personal projects
- MVPs
- Small apps with <1000 users

---

## 🔒 **Security Best Practices**

### For Production:
1. **Use signed uploads** (requires backend)
2. **Implement upload limits** per user
3. **Add content moderation** (Cloudinary has AI moderation addon)
4. **Validate file types** on backend

### Quick Security Rules:
```typescript
// Add file size validation
if (file.size > 5 * 1024 * 1024) {
  throw new Error('File too large (max 5MB)');
}

// Add type validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}
```

---

## 🆚 **Cloudinary vs Firebase Storage**

| Feature | Cloudinary | Firebase Storage |
|---------|------------|------------------|
| Free Storage | 25 GB | 5 GB |
| Free Bandwidth | 25 GB/month | 1 GB/day |
| Image Optimization | ✅ Built-in | ❌ Manual |
| CDN | ✅ Global | ✅ Google CDN |
| CORS Issues | ✅ None | ⚠️ Need config |
| Transformations | ✅ 25k/month | ❌ None |
| Setup | ✅ Easy | ⚠️ Medium |

**Recommendation:** Use Cloudinary for images/videos, Firebase for user data.

---

## 🎯 **Quick Start Checklist**

- [ ] Create Cloudinary account
- [ ] Get cloud name from dashboard
- [ ] Create unsigned upload preset
- [ ] Install `cloudinary-react` package
- [ ] Create `services/cloudinary.ts` file
- [ ] Update cloud name in config
- [ ] Test upload in your app
- [ ] Check Cloudinary dashboard

---

## 🐛 **Troubleshooting**

### "Upload failed" error
- Check cloud name is correct
- Verify upload preset exists and is **unsigned**
- Check preset name matches exactly

### "Invalid upload preset"
- Make sure preset is set to "Unsigned"
- Check spelling of preset name

### Images not loading
- Verify URL is HTTPS (secure_url)
- Check network tab for actual error
- Try opening URL directly in browser

---

## 🚀 **Next Steps**

1. Follow Step 1-8 above
2. Test image upload
3. Enjoy 5x more storage than Firebase!
4. (Optional) Set up image transformations for thumbnails

**Happy uploading!** ☁️✨
