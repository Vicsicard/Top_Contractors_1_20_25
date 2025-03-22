/**
 * Submit sitemap to Google for indexing
 * 
 * This script sends a request to Google to notify them about your updated sitemap.
 * Run this script after generating new sitemaps to help Google discover and index your content faster.
 */

const https = require('https');

const SITE_URL = 'https://topcontractorsdenver.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

console.log(`Submitting sitemap to Google: ${SITEMAP_URL}`);

// Ping Google
const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;

https.get(googleUrl, (res) => {
  console.log(`Google response status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('Successfully submitted sitemap to Google!');
  } else {
    console.error(`Failed to submit sitemap to Google. Status code: ${res.statusCode}`);
  }
}).on('error', (err) => {
  console.error(`Error submitting sitemap to Google: ${err.message}`);
});

// Also submit the blog-specific sitemap
const blogSitemapUrl = `${SITE_URL}/sitemap-blog.xml`;
const googleBlogUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(blogSitemapUrl)}`;

console.log(`\nSubmitting blog sitemap to Google: ${blogSitemapUrl}`);

https.get(googleBlogUrl, (res) => {
  console.log(`Google response status for blog sitemap: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('Successfully submitted blog sitemap to Google!');
  } else {
    console.error(`Failed to submit blog sitemap to Google. Status code: ${res.statusCode}`);
  }
}).on('error', (err) => {
  console.error(`Error submitting blog sitemap to Google: ${err.message}`);
});

console.log('\nDone! Google has been notified about your updated sitemaps.');
console.log('Note: It may take some time for Google to crawl and index your new content.');
