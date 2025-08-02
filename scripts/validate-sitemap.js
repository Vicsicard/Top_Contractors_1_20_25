// Sitemap validation script
const fs = require('fs');
const path = require('path');
const { DOMParser } = require('@xmldom/xmldom');
const fetch = require('node-fetch');

// Configuration
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SITE_URL = 'https://topcontractorsdenver.com';
const MAX_URL_LENGTH = 2048; // Maximum recommended URL length
const MAX_SITEMAP_SIZE = 50 * 1024 * 1024; // 50MB max size
const MAX_URLS_PER_SITEMAP = 50000; // Google's limit

// Validation functions
async function validateSitemapIndex() {
  console.log('\n=== Validating Sitemap Index ===');
  const indexPath = path.join(PUBLIC_DIR, 'sitemap-index.xml');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Sitemap index file not found!');
    return false;
  }
  
  const content = fs.readFileSync(indexPath, 'utf8');
  const fileSize = fs.statSync(indexPath).size;
  
  console.log(`Sitemap index file size: ${(fileSize / 1024).toFixed(2)} KB`);
  
  if (fileSize > MAX_SITEMAP_SIZE) {
    console.error(`❌ Sitemap index exceeds maximum size of ${MAX_SITEMAP_SIZE / (1024 * 1024)}MB`);
    return false;
  }
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');
    const sitemaps = doc.getElementsByTagName('sitemap');
    
    console.log(`Found ${sitemaps.length} sitemaps in index`);
    
    if (sitemaps.length === 0) {
      console.error('❌ No sitemaps found in sitemap index!');
      return false;
    }
    
    // Check each sitemap in the index
    for (let i = 0; i < sitemaps.length; i++) {
      const locNode = sitemaps[i].getElementsByTagName('loc')[0];
      if (!locNode) {
        console.error(`❌ Sitemap #${i+1} is missing a location (loc) tag`);
        continue;
      }
      
      const sitemapUrl = locNode.textContent;
      console.log(`Checking sitemap: ${sitemapUrl}`);
      
      // Verify sitemap URL
      if (!sitemapUrl.startsWith(SITE_URL)) {
        console.error(`❌ Sitemap URL does not match site URL: ${sitemapUrl}`);
      }
      
      // Extract filename from URL
      const filename = sitemapUrl.split('/').pop();
      const localPath = path.join(PUBLIC_DIR, filename);
      
      // Check if the sitemap file exists locally
      if (!fs.existsSync(localPath)) {
        console.error(`❌ Referenced sitemap file not found locally: ${filename}`);
      }
    }
    
    console.log('✅ Sitemap index validation completed');
    return true;
    
  } catch (error) {
    console.error('❌ Error parsing sitemap index:', error.message);
    return false;
  }
}

async function validateSitemap(sitemapFile) {
  console.log(`\n=== Validating ${sitemapFile} ===`);
  const sitemapPath = path.join(PUBLIC_DIR, sitemapFile);
  
  if (!fs.existsSync(sitemapPath)) {
    console.error(`❌ Sitemap file not found: ${sitemapFile}`);
    return false;
  }
  
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const fileSize = fs.statSync(sitemapPath).size;
  
  console.log(`Sitemap file size: ${(fileSize / 1024).toFixed(2)} KB`);
  
  if (fileSize > MAX_SITEMAP_SIZE) {
    console.error(`❌ Sitemap exceeds maximum size of ${MAX_SITEMAP_SIZE / (1024 * 1024)}MB`);
    return false;
  }
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');
    const urls = doc.getElementsByTagName('url');
    
    console.log(`Found ${urls.length} URLs in sitemap`);
    
    if (urls.length === 0) {
      console.error('❌ No URLs found in sitemap!');
      return false;
    }
    
    if (urls.length > MAX_URLS_PER_SITEMAP) {
      console.error(`❌ Sitemap exceeds maximum of ${MAX_URLS_PER_SITEMAP} URLs per sitemap`);
    }
    
    // Check a sample of URLs (first 5, last 5, and 5 random ones)
    const samplesToCheck = Math.min(15, urls.length);
    const urlsToCheck = new Set();
    
    // Add first 5
    for (let i = 0; i < Math.min(5, urls.length); i++) {
      urlsToCheck.add(i);
    }
    
    // Add last 5
    for (let i = Math.max(0, urls.length - 5); i < urls.length; i++) {
      urlsToCheck.add(i);
    }
    
    // Add 5 random ones
    while (urlsToCheck.size < samplesToCheck && urlsToCheck.size < urls.length) {
      const randomIndex = Math.floor(Math.random() * urls.length);
      urlsToCheck.add(randomIndex);
    }
    
    // Convert to array and sort
    const urlIndices = Array.from(urlsToCheck).sort((a, b) => a - b);
    
    // Check each URL in the sample
    for (const index of urlIndices) {
      const url = urls[index];
      const locNode = url.getElementsByTagName('loc')[0];
      
      if (!locNode) {
        console.error(`❌ URL #${index+1} is missing a location (loc) tag`);
        continue;
      }
      
      const urlLoc = locNode.textContent;
      
      // Check URL format
      if (!urlLoc.startsWith(SITE_URL)) {
        console.error(`❌ URL does not match site URL: ${urlLoc}`);
      }
      
      if (urlLoc.length > MAX_URL_LENGTH) {
        console.error(`❌ URL exceeds maximum length (${urlLoc.length} > ${MAX_URL_LENGTH}): ${urlLoc}`);
      }
      
      // Check for required tags
      const lastmodNode = url.getElementsByTagName('lastmod')[0];
      if (!lastmodNode) {
        console.warn(`⚠️ URL is missing lastmod tag: ${urlLoc}`);
      } else {
        // Validate lastmod format (ISO 8601)
        const lastmod = lastmodNode.textContent;
        if (!lastmod.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/)) {
          console.warn(`⚠️ Invalid lastmod format: ${lastmod} for URL: ${urlLoc}`);
        }
      }
      
      const changefreqNode = url.getElementsByTagName('changefreq')[0];
      if (!changefreqNode) {
        console.warn(`⚠️ URL is missing changefreq tag: ${urlLoc}`);
      } else {
        // Validate changefreq value
        const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
        const changefreq = changefreqNode.textContent;
        if (!validFrequencies.includes(changefreq)) {
          console.warn(`⚠️ Invalid changefreq value: ${changefreq} for URL: ${urlLoc}`);
        }
      }
      
      const priorityNode = url.getElementsByTagName('priority')[0];
      if (!priorityNode) {
        console.warn(`⚠️ URL is missing priority tag: ${urlLoc}`);
      } else {
        // Validate priority value (0.0 to 1.0)
        const priority = parseFloat(priorityNode.textContent);
        if (isNaN(priority) || priority < 0 || priority > 1) {
          console.warn(`⚠️ Invalid priority value: ${priorityNode.textContent} for URL: ${urlLoc}`);
        }
      }
    }
    
    console.log(`✅ Validated ${urlIndices.length} sample URLs in ${sitemapFile}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error parsing sitemap ${sitemapFile}:`, error.message);
    return false;
  }
}

async function checkSitemapSize(sitemapFile) {
  const sitemapPath = path.join(PUBLIC_DIR, sitemapFile);
  
  if (!fs.existsSync(sitemapPath)) {
    return { exists: false };
  }
  
  const stats = fs.statSync(sitemapPath);
  const fileSizeInBytes = stats.size;
  const fileSizeInKB = fileSizeInBytes / 1024;
  const fileSizeInMB = fileSizeInKB / 1024;
  
  return {
    exists: true,
    sizeBytes: fileSizeInBytes,
    sizeKB: fileSizeInKB.toFixed(2),
    sizeMB: fileSizeInMB.toFixed(2),
    tooLarge: fileSizeInBytes > MAX_SITEMAP_SIZE
  };
}

// Main validation function
async function validateAllSitemaps() {
  console.log('Starting sitemap validation...');
  
  // First, check sitemap sizes
  console.log('\n=== Checking Sitemap Sizes ===');
  const sitemapFiles = [
    'sitemap-index.xml',
    'sitemap-static.xml',
    'sitemap-blog.xml',
    'sitemap-trades.xml',
    'sitemap-videos.xml'
  ];
  
  for (const file of sitemapFiles) {
    const sizeInfo = await checkSitemapSize(file);
    if (sizeInfo.exists) {
      console.log(`${file}: ${sizeInfo.sizeKB} KB${sizeInfo.tooLarge ? ' ❌ TOO LARGE' : ' ✅'}`);
    } else {
      console.error(`${file}: ❌ NOT FOUND`);
    }
  }
  
  // Validate sitemap index
  await validateSitemapIndex();
  
  // Validate individual sitemaps
  for (const file of sitemapFiles.filter(f => f !== 'sitemap-index.xml')) {
    await validateSitemap(file);
  }
  
  console.log('\n✅ Sitemap validation completed');
}

// Run validation
validateAllSitemaps().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
});
