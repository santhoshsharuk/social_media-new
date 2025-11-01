# 🚀 GitHub Pages Deployment Guide

## 📋 Prerequisites
- GitHub account
- Git installed on your machine
- Repository created on GitHub

## 🔧 Configuration Complete

Your project is now configured for GitHub Pages deployment with the following changes:

### Files Modified/Created:
1. ✅ `vite.config.ts` - Added base path and build optimizations
2. ✅ `package.json` - Added deploy script and homepage URL
3. ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow for automated deployment
4. ✅ `public/.nojekyll` - Prevents Jekyll processing

## � How It Works

```
┌─────────────────┐
│  Push to main   │
│     branch      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│  Triggered      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Install deps &  │
│  Build project  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Push built code │
│  to gh-pages    │
│     branch      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Pages    │
│ serves website  │
└─────────────────┘
```

**Branches:**
- `main` - Your source code (development)
- `gh-pages` - Built/compiled files (production) - **Auto-created by GitHub Actions**

## �📝 Step-by-Step Deployment Instructions

### Step 1: Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - Ready for GitHub Pages deployment"
```

### Step 2: Connect to GitHub Repository
```bash
# Replace 'santhoshsharuk' with your GitHub username if different
git remote add origin https://github.com/santhoshsharuk/social_media-new.git
git branch -M main
git push -u origin main
```

### Step 3: Configure GitHub Repository Settings

1. Go to your repository on GitHub: `https://github.com/santhoshsharuk/social_media-new`

2. Click on **Settings** tab

3. Scroll down to **Pages** section (left sidebar)

4. Under **Build and deployment**:
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select "gh-pages" / (root)
   - Click "Save"
   
   Note: The `gh-pages` branch will be automatically created by GitHub Actions on first deployment.

### Step 4: Deploy

#### Option A: Automatic Deployment (Recommended)
```bash
# Simply push to main branch - GitHub Actions will automatically build and deploy to gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

The workflow will:
1. ✅ Checkout your code from `main` branch
2. ✅ Install dependencies
3. ✅ Build the project
4. ✅ Create/update `gh-pages` branch with the built files
5. ✅ GitHub Pages serves from `gh-pages` branch automatically

#### Option B: Manual Trigger
1. Go to repository → **Actions** tab
2. Select "Build and Deploy to gh-pages" workflow
3. Click "Run workflow" → "Run workflow"

### Step 5: Access Your Deployed Site

After deployment completes (2-3 minutes), your site will be live at:
**https://santhoshsharuk.github.io/social_media-new/**

## 🔍 Monitoring Deployment

1. Go to **Actions** tab in your repository
2. You'll see the deployment workflow running
3. Green checkmark ✅ = Successful deployment
4. Red X ❌ = Failed (click to see error logs)

## 🛠️ Local Testing Before Deploy

Test the production build locally:
```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## 📱 Important Notes

### Base Path Configuration
- The app is configured with base path `/social_media-new/`
- This matches your GitHub repository name
- If you rename the repository, update `vite.config.ts`:
  ```typescript
  base: '/your-new-repo-name/'
  ```

### Routing Configuration
- Client-side routing is handled by the custom router
- GitHub Pages serves the `index.html` for all routes automatically

### Firebase Configuration
- Make sure your Firebase project allows the GitHub Pages domain
- Add to Firebase Console → Authentication → Authorized domains:
  - `santhoshsharuk.github.io`

### Environment Variables
- Build-time variables are set in GitHub Actions secrets
- Never commit sensitive data to the repository

## 🐛 Troubleshooting

### Issue: 404 Not Found
**Solution**: Check that:
- Repository name matches the base path in `vite.config.ts`
- GitHub Pages is enabled in repository settings
- The deployment workflow completed successfully

### Issue: Assets Not Loading
**Solution**: 
- Verify `base` path in `vite.config.ts` matches your repository name
- Clear browser cache and hard reload (Ctrl+Shift+R)

### Issue: Firebase Not Working
**Solution**:
- Add GitHub Pages domain to Firebase authorized domains
- Verify Firebase config in `services/firebaseConfig.ts`
- Check browser console for CORS errors

### Issue: Build Fails in GitHub Actions
**Solution**:
- Check Actions logs for specific error
- Verify all dependencies are listed in `package.json`


## 🔄 Updating Your Site

Every time you push to the `main` branch, GitHub Actions will:
1. Automatically build your project
2. Deploy the new version to GitHub Pages
3. Make it live within 2-3 minutes

```bash
# Make your changes
git add .
git commit -m "Update description"
git push origin main
# Wait 2-3 minutes for automatic deployment
```

## 📊 Build Optimization

The configuration includes:
- Code splitting for React and Firebase
- Minification with esbuild
- Asset optimization
- Source map removal for smaller builds

## 🎉 Success Checklist

- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled (Source: GitHub Actions)

- [ ] Firebase domain authorized
- [ ] First deployment completed
- [ ] Site accessible at GitHub Pages URL

## 📞 Need Help?

If you encounter issues:
1. Check GitHub Actions logs for errors
2. Verify all configuration files are committed
3. Ensure GitHub Pages is enabled in repository settings
4. Check that all secrets are properly set

---

**Your deployment URL**: https://santhoshsharuk.github.io/social_media-new/

**Repository URL**: https://github.com/santhoshsharuk/social_media-new

Happy Deploying! 🚀
