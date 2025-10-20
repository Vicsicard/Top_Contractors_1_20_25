# SEO Fixes Deployment Checklist

## Pre-Deployment ✅

- [x] All code changes tested locally
- [x] Build successful (no errors)
- [x] Sitemaps regenerated with correct URLs
- [x] ESLint warnings reviewed (2 minor warnings, non-blocking)

## Deployment Steps

### 1. Commit Changes
```bash
git add .
git commit -m "Fix critical SEO issues: www redirects, trailing slashes, noindex tags, and sitemap URLs"
git push origin merged-blog-table-3-23-25
```

### 2. Deploy to Production
- Push to main/production branch
- Vercel will auto-deploy
- Monitor deployment logs

### 3. Verify Deployment (Immediately After)
- [ ] Check homepage: https://topcontractorsdenver.com/
- [ ] Test www redirect: https://www.topcontractorsdenver.com/ → should redirect to non-www
- [ ] Verify trailing slashes work: /blog → /blog/
- [ ] Check sitemap: https://topcontractorsdenver.com/sitemap.xml
- [ ] Test blog pagination: https://topcontractorsdenver.com/blog/?page=2

### 4. Submit to Google Search Console (Within 24 Hours)
```bash
# Optional: Use the submission script
node scripts/submit-sitemap-to-google.js
```

**Manual Steps:**
1. Go to Google Search Console
2. Navigate to Sitemaps section
3. Remove old sitemaps (if any errors)
4. Submit new sitemap: `https://topcontractorsdenver.com/sitemap.xml`
5. Request indexing for key pages:
   - Homepage
   - /blog/
   - /trades/
   - /services/
   - Top 10 blog posts

### 5. Monitor (First Week)

**Daily Checks:**
- [ ] Google Search Console → Coverage report
- [ ] Check for 404 errors in server logs
- [ ] Monitor redirect errors (should decrease)
- [ ] Verify organic traffic (Google Analytics)

**What to Look For:**
- ✅ Redirect errors dropping from 626
- ✅ Noindex errors dropping from 78
- ✅ New pages being crawled
- ⚠️ Any unexpected 404s or 500s

### 6. Week 2-4 Monitoring

**Weekly Checks:**
- [ ] GSC Coverage report (track indexing progress)
- [ ] Organic traffic trends
- [ ] Crawl stats (requests per day)
- [ ] Core Web Vitals (ensure no performance regression)

**Expected Results:**
- 626 redirect errors → <10 (within 2 weeks)
- 78 noindex errors → 0 (within 1 week)
- 1,360 "Crawled - Not Indexed" → decreasing
- 201 "Discovered - Not Indexed" → decreasing

## Rollback Plan

If critical issues occur:

```bash
# Revert all changes
git revert HEAD
git push origin merged-blog-table-3-23-25

# Or revert specific files
git checkout HEAD~1 src/middleware.ts
git checkout HEAD~1 next.config.js
git checkout HEAD~1 scripts/generate-split-sitemaps.mjs
```

## Success Criteria

### Week 1
- ✅ Build and deployment successful
- ✅ No 404 errors
- ✅ www redirects working
- ✅ Sitemaps submitted to GSC

### Week 2
- ✅ Redirect errors < 100 (from 626)
- ✅ Noindex errors = 0 (from 78)
- ✅ No traffic drop

### Week 4
- ✅ Redirect errors < 10
- ✅ "Crawled - Not Indexed" decreasing
- ✅ Organic traffic stable or increasing

### Week 8
- ✅ All major indexing issues resolved
- ✅ 10-20% increase in indexed pages
- ✅ Improved organic traffic

## Files Changed

1. `src/middleware.ts` - www redirect + trailing slash handling
2. `next.config.js` - redirects configuration
3. `src/app/blog/tag/[tag]/page.tsx` - robots metadata
4. `scripts/generate-split-sitemaps.mjs` - URL format fixes
5. `public/robots.txt` - removed query param blocking
6. `public/sitemap-*.xml` - regenerated

## Support Contacts

- **Developer:** Cascade AI
- **Date:** October 20, 2025
- **Documentation:** SEO_FIXES_2025_10_20.md

## Notes

- All changes are backward compatible
- 301 redirects preserve SEO value
- No content changes, only URL standardization
- Performance impact: minimal (edge redirects)
