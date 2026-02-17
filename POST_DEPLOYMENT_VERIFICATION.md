# Post-Deployment Verification Checklist

## ✅ Deployment Status

**Commit:** `189394b`  
**Branch:** `merged-blog-table-3-23-25`  
**Status:** Successfully pushed to GitHub  
**Date:** October 20, 2025  

---

## 🔍 Immediate Verification (Do Now)

### 1. Test WWW Redirect
```bash
# Should redirect to non-www
curl -I https://www.topcontractorsdenver.com/
```

**Expected:** 301 redirect to `https://topcontractorsdenver.com/`

**Manual Test:**
- Visit: https://www.topcontractorsdenver.com/
- Should redirect to: https://topcontractorsdenver.com/

---

### 2. Test Trailing Slash Redirect
```bash
# Should add trailing slash
curl -I https://topcontractorsdenver.com/blog
```

**Expected:** 301 redirect to `https://topcontractorsdenver.com/blog/`

**Manual Test:**
- Visit: https://topcontractorsdenver.com/blog
- Should redirect to: https://topcontractorsdenver.com/blog/

---

### 3. Verify Sitemap
**URL:** https://topcontractorsdenver.com/sitemap.xml

**Check:**
- [ ] Sitemap loads successfully
- [ ] Contains sitemap index with 4 sub-sitemaps
- [ ] All URLs use `https://topcontractorsdenver.com` (no www)
- [ ] All URLs have trailing slashes

**Sub-sitemaps to verify:**
- https://topcontractorsdenver.com/sitemap-static.xml
- https://topcontractorsdenver.com/sitemap-blog.xml
- https://topcontractorsdenver.com/sitemap-trades.xml
- https://topcontractorsdenver.com/sitemap-videos.xml

---

### 4. Test Key Pages
**Check these pages load correctly:**

- [ ] Homepage: https://topcontractorsdenver.com/
- [ ] Blog: https://topcontractorsdenver.com/blog/
- [ ] Blog pagination: https://topcontractorsdenver.com/blog/?page=2
- [ ] Trades: https://topcontractorsdenver.com/trades/
- [ ] Services: https://topcontractorsdenver.com/services/
- [ ] About: https://topcontractorsdenver.com/about/

---

### 5. Test Blog Tag Pages (Noindex Fix)
**Visit a tag page:**
- https://topcontractorsdenver.com/blog/tag/plumbing/

**Check:**
- [ ] Page loads successfully
- [ ] View page source
- [ ] Look for: `<meta name="robots" content="index, follow">`
- [ ] Should NOT see: `noindex`

---

### 6. Verify Canonical URLs
**Check these pages have correct canonical tags:**

**Blog post example:**
- Visit: https://topcontractorsdenver.com/blog/vinyl-vs-aluminum-windows-choosing-the-right-one-for-denver-homes/
- View source
- Look for: `<link rel="canonical" href="https://topcontractorsdenver.com/blog/vinyl-vs-aluminum-windows-choosing-the-right-one-for-denver-homes/">`

**Trade page example:**
- Visit: https://topcontractorsdenver.com/trades/plumbing/
- View source
- Look for: `<link rel="canonical" href="https://topcontractorsdenver.com/trades/plumbing/">`

---

## 📊 Google Search Console Actions (Within 24 Hours)

### 1. Submit Updated Sitemap

**Steps:**
1. Go to: https://search.google.com/search-console
2. Select property: `topcontractorsdenver.com`
3. Navigate to: **Sitemaps** (left menu)
4. Remove old sitemap if it has errors
5. Add new sitemap: `https://topcontractorsdenver.com/sitemap.xml`
6. Click **Submit**

**Expected:** "Success" message

---

### 2. Request Indexing for Key Pages

**Pages to request indexing:**
1. Homepage: `https://topcontractorsdenver.com/`
2. Blog: `https://topcontractorsdenver.com/blog/`
3. Trades: `https://topcontractorsdenver.com/trades/`
4. Services: `https://topcontractorsdenver.com/services/`
5. Top 5 blog posts (pick your most important ones)

**Steps for each URL:**
1. Go to: **URL Inspection** (top of GSC)
2. Enter the URL
3. Click **Request Indexing**
4. Wait for confirmation

---

### 3. Export Problem URLs

**Soft 404s (23 pages):**
1. Go to: **Pages** → **Why pages aren't indexed**
2. Click on: **Soft 404**
3. Click: **Export** → Download CSV
4. Save as: `soft-404-urls.csv`

**404 Errors (5 pages):**
1. Go to: **Pages** → **Why pages aren't indexed**
2. Click on: **Not found (404)**
3. Click: **Export** → Download CSV
4. Save as: `404-urls.csv`

**Share these files so I can create fixes for them.**

---

## 📈 Monitoring Schedule

### Daily (First Week)

**Check Google Search Console:**
- [ ] Coverage report (Pages section)
- [ ] Look for new errors
- [ ] Monitor redirect count (should decrease from 655)
- [ ] Monitor noindex count (should decrease from 78)

**Check Analytics:**
- [ ] Organic traffic (should remain stable)
- [ ] No unusual drops in traffic
- [ ] Page views per session

---

### Weekly (Weeks 2-4)

**Google Search Console:**
- [ ] Page indexing status
- [ ] Redirect errors (target: <100 by week 2, <10 by week 4)
- [ ] Noindex errors (target: 0 by week 2)
- [ ] Crawl stats (requests per day)

**Analytics:**
- [ ] Organic traffic trends
- [ ] Top landing pages
- [ ] Bounce rate changes

---

## 🎯 Success Metrics

### Week 1 Targets
- ✅ Deployment successful
- ✅ No 404 errors on key pages
- ✅ WWW redirect working
- ✅ Sitemap submitted to GSC
- Target: Redirect errors < 100 (from 655)
- Target: Noindex errors = 0 (from 78)

### Week 2 Targets
- Redirect errors < 50
- All validation issues resolved
- Soft 404s investigated and fixed
- 404 errors fixed with redirects

### Week 4 Targets
- Redirect errors < 10
- "Crawled - not indexed" decreasing
- Organic traffic stable or increasing

### Week 8 Targets
- All major issues resolved
- 10-20% increase in indexed pages
- 10-20% increase in organic traffic

---

## 🚨 Troubleshooting

### If WWW Redirect Doesn't Work

**Check:**
1. Vercel deployment logs
2. Middleware is deployed
3. DNS settings (should point both www and non-www to Vercel)

**Fix:**
- Vercel should handle this automatically
- Check Vercel dashboard → Settings → Domains

---

### If Trailing Slashes Don't Work

**Check:**
1. `next.config.js` has `trailingSlash: true`
2. Middleware is working
3. Clear browser cache

**Fix:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

### If Sitemap Doesn't Update

**Check:**
1. Build completed successfully
2. Sitemap files in `/public` directory
3. Vercel deployment included sitemap generation

**Fix:**
```bash
# Regenerate locally
npm run generate-sitemaps

# Commit and push
git add public/sitemap*.xml
git commit -m "Update sitemaps"
git push
```

---

### If Pages Return 404

**Check:**
1. URL format (should have trailing slash)
2. Page exists in build
3. No typos in URL

**Fix:**
- Add redirect in `next.config.js` if old URL format

---

## 📞 Support

**Documentation:**
- Technical details: `SEO_FIXES_2025_10_20.md`
- Investigation plan: `SEO_ISSUES_INVESTIGATION.md`
- Deployment guide: `DEPLOYMENT_CHECKLIST.md`

**Next Steps:**
1. Complete verification checklist above
2. Submit sitemap to GSC
3. Export Soft 404 and 404 URL lists
4. Share lists for investigation
5. Monitor daily for first week

---

## ✅ Verification Complete

Once you've completed all checks above, mark this section:

- [ ] All redirects working
- [ ] Sitemap submitted to GSC
- [ ] Key pages loading correctly
- [ ] Canonical URLs correct
- [ ] No new errors introduced
- [ ] Monitoring schedule set up

**Status:** Ready for monitoring phase

**Next Action:** Export Soft 404 and 404 URL lists from GSC
