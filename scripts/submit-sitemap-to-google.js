/**
 * Submit sitemap to Google for indexing
 * 
 * This script sends a request to Google to notify them about your updated sitemap.
 * Run this script after generating new sitemaps to help Google discover and index your content faster.
 */

const https = require('https');

const SITE_URL = 'https://topcontractorsdenver.com';

// Define all sitemaps to submit
const sitemaps = [
  // Use the sitemap index file which references all other sitemaps
  { name: 'Sitemap index', url: `${SITE_URL}/sitemap.xml` },
  
  // Submit individual sitemaps directly to Google Search Console
  // These are referenced in the sitemap index
  { name: 'Static pages sitemap', url: `${SITE_URL}/sitemap-static.xml` },
  { name: 'Blog sitemap', url: `${SITE_URL}/sitemap-blog.xml` },
  { name: 'Blog pagination sitemap', url: `${SITE_URL}/sitemap-blog-pagination.xml` },
  { name: 'Trades sitemap', url: `${SITE_URL}/sitemap-trades.xml` },
  { name: 'Videos sitemap', url: `${SITE_URL}/sitemap-videos.xml` }
];

// Function to submit a sitemap to Google
function submitSitemapToGoogle(sitemap) {
  return new Promise((resolve, reject) => {
    console.log(`Submitting ${sitemap.name} to Google: ${sitemap.url}`);
    
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemap.url)}`;
    
    https.get(googleUrl, (res) => {
      console.log(`Google response status for ${sitemap.name}: ${res.statusCode}`);
      
      if (res.statusCode === 200) {
        console.log(`Successfully submitted ${sitemap.name} to Google!`);
        resolve(true);
      } else {
        console.error(`Failed to submit ${sitemap.name} to Google. Status code: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`Error submitting ${sitemap.name} to Google: ${err.message}`);
      reject(err);
    });
  });
}

// Submit all sitemaps with a delay between each to avoid rate limiting
async function submitAllSitemaps() {
  for (const sitemap of sitemaps) {
    try {
      await submitSitemapToGoogle(sitemap);
      // Add a small delay between submissions
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to submit ${sitemap.name}:`, error);
    }
  }
  
  console.log('\nAll sitemaps have been submitted to Google!');
}

// Start the submission process
submitAllSitemaps();

console.log('\nDone! Google has been notified about your updated sitemaps.');
console.log('Note: It may take some time for Google to crawl and index your new content.');
