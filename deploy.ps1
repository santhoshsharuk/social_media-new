# Quick Deploy Script
# Run this file to deploy your changes to GitHub Pages

Write-Host "🚀 Starting GitHub Pages Deployment..." -ForegroundColor Cyan
Write-Host ""

# Add all changes
Write-Host "📦 Adding all changes..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update: Deploy to GitHub Pages - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}
git commit -m $commitMessage

# Push to GitHub
Write-Host "🌐 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Monitor deployment progress at:" -ForegroundColor Cyan
Write-Host "   https://github.com/santhoshsharuk/social_media-new/actions" -ForegroundColor White
Write-Host ""
Write-Host "🌍 Your site will be live in 2-3 minutes at:" -ForegroundColor Cyan
Write-Host "   https://santhoshsharuk.github.io/social_media-new/" -ForegroundColor White
Write-Host ""
Write-Host "⏳ GitHub Actions is now building and deploying your site..." -ForegroundColor Yellow
