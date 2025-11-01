# 🚀 Quick Deployment Reference

## Current Setup:
- **Source Branch**: `main` (your code)
- **Deploy Branch**: `gh-pages` (auto-created, built files)
- **Deployment**: Automatic on push to `main`

## 📋 First Time Setup Checklist:

### 1. Configure GitHub Pages
- Go to: Settings → Pages
- Source: "Deploy from a branch"
- Branch: "gh-pages" / (root)
- **Note**: Branch will be created automatically on first deploy

### 2. Update Firebase
- Firebase Console → Authentication → Settings
- Add domain: `santhoshsharuk.github.io`

## 🎯 Deploy Your Changes:

```powershell
# Option 1: Use deploy script
.\deploy.ps1

# Option 2: Manual
git add .
git commit -m "Your message"
git push origin main
```

## 📊 Monitor Deployment:

1. **Actions Tab**: https://github.com/santhoshsharuk/social_media-new/actions
   - See build progress
   - Check for errors
   - View deployment logs

2. **Branches**: https://github.com/santhoshsharuk/social_media-new/branches
   - See `gh-pages` branch (created after first deploy)

3. **Live Site**: https://santhoshsharuk.github.io/social_media-new/
   - Available 2-3 minutes after successful deployment

## 🔍 Workflow Details:

### What happens when you push to `main`:

1. ✅ GitHub Actions detects push
2. ✅ Runs Ubuntu environment
3. ✅ Installs Node.js & dependencies
4. ✅ Builds project (`npm run build`)
5. ✅ Takes `dist` folder contents
6. ✅ Pushes to `gh-pages` branch
7. ✅ GitHub Pages serves the site

### Branch Structure:
```
main branch (source):
├── src/
├── components/
├── views/
├── App.tsx
└── package.json

gh-pages branch (built):
├── index.html
└── assets/
    ├── index-xxx.js
    └── index-xxx.css
```

## 🛠️ Troubleshooting:

### Build Failed?
```powershell
# Test build locally first
npm run build
```

### Changes not showing?
- Wait 2-3 minutes
- Hard refresh: Ctrl + Shift + R
- Check Actions tab for errors

### 404 Error?
- Verify Settings → Pages → Branch is "gh-pages"
- Check if gh-pages branch exists
- Verify base path in vite.config.ts

## 📱 Important Files:

- `.github/workflows/deploy.yml` - Deployment automation
- `vite.config.ts` - Base path configuration
- `deploy.ps1` - Quick deploy script
- `GITHUB_PAGES_DEPLOYMENT.md` - Full guide

## 🎉 Success Indicators:

✅ Green checkmark in Actions tab
✅ `gh-pages` branch exists
✅ Latest commit shows in gh-pages
✅ Site loads at GitHub Pages URL

---

**Live URL**: https://santhoshsharuk.github.io/social_media-new/
**Repository**: https://github.com/santhoshsharuk/social_media-new
