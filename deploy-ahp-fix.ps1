# Deploy AHP Module Fix to Top Contractors
Write-Host "`nDeploying AHP Module Fix..." -ForegroundColor Cyan

git add src/app/layout.tsx
git commit -m "Update AHP module to v2025-10-17 - Fix bot tracking"
git push

Write-Host "`n✅ Pushed to Git - Vercel will auto-deploy" -ForegroundColor Green
Write-Host "Check Vercel dashboard for deployment status" -ForegroundColor Yellow
