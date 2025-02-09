# Sitemap and SEO Optimization Plan (2025-02-09)

## 1. Technical Fixes
- [x] Fix metadata base URL in layout.tsx
- [x] Update robots.txt with proper crawl settings and sitemaps
- [x] Create sitemap index file
- [x] Split sitemap into multiple files:
  - [x] sitemap-static.xml
  - [x] sitemap-blog.xml
  - [x] sitemap-trades.xml
  - [x] sitemap-videos.xml

## 2. Sitemap Generation Improvements
- [x] Update sitemap generation:
  - [x] Add URL validation before adding to sitemap
  - [x] Add error logging for invalid URLs
  - [x] Remove rate limiting (no longer needed with split sitemaps)
  - [x] Add proper lastmod dates for all URLs
  - [x] Add proper changefreq based on content type
  - [x] Add proper priority based on page importance

## 3. Navigation and Internal Linking
- [x] Add Trades section to main navigation
- [x] Create /sitemap page with links to all content
- [x] Add breadcrumb navigation to all pages
- [x] Add Related Posts section to blog posts
- [x] Add Related Services section to trade pages
- [x] Ensure all pages are reachable within 3 clicks from homepage

## 4. New Pages and Components
- [x] Create /trades index page
- [x] Create /sitemap page
- [x] Create BreadcrumbNav component
- [x] Create RelatedContent component
- [x] Create SitemapGenerator component for /sitemap page

## 5. Monitoring and Validation
- [x] Create URL validation script
- [x] Add monitoring for 404 errors
- [x] Add sitemap generation to build process
- [x] Create weekly sitemap validation job

## 6. Google Search Console Tasks
- [ ] Submit sitemap-index.xml
- [ ] Submit individual sitemaps
- [ ] Request indexing for important pages:
  - [ ] Homepage
  - [ ] Main trade category pages
  - [ ] Recent blog posts
  - [ ] Service area pages
- [ ] Monitor coverage report for issues

## Progress Log

### 2025-02-09 08:11 MST
- ✅ Created new-sitemap-2-9-25.md checklist
- ✅ Fixed metadata base URL in layout.tsx
- ✅ Updated robots.txt
- ✅ Created sitemap-index.xml

### 2025-02-09 08:15 MST
- ✅ Created generate-split-sitemaps.mjs with URL validation
- ✅ Created /trades index page with proper SEO metadata
- ✅ Created BreadcrumbNav component
- ✅ Added Trades section to main navigation

### 2025-02-09 08:20 MST
- ✅ Created RelatedContent component
- ✅ Created /sitemap page with comprehensive site structure
- ✅ Added related posts to blog pages
- ✅ Created monitoring script for 404 errors
- ✅ Added sitemap generation to build process

### Next Steps
1. Submit sitemaps to Google Search Console
2. Request indexing for important pages
3. Monitor coverage report for any issues

## Notes
- All changes should be tested in development before pushing to production
- Monitor Google Search Console daily for the first week after changes
- Document any 404 errors or crawl issues for investigation
- The URL validation in generate-split-sitemaps.mjs will help catch any broken links early
- Added comprehensive monitoring with monitor-404s.mjs script
- Sitemap generation is now automated as part of the build process
