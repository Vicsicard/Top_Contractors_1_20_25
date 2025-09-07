/**
 * Monitor Google indexing status
 * 
 * This script helps track the indexing status of your website by checking
 * the Google Search Console API or performing a site: search.
 * 
 * Note: For full API access, you'll need to set up Google Search Console API credentials.
 * This script provides a simplified version using direct site: searches.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'topcontractorsdenver.com';
const REPORT_FILE = path.join(__dirname, '../reports/indexing-status.json');

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Load previous report if it exists
let previousReport = {};
if (fs.existsSync(REPORT_FILE)) {
  try {
    previousReport = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading previous report:', error);
  }
}

// Create a new report
const report = {
  timestamp: new Date().toISOString(),
  site: SITE_URL,
  checks: []
};

// List of URL patterns to check
const urlsToCheck = [
  { type: 'Homepage', url: '' },
  { type: 'Blog main page', url: 'blog/' },
  { type: 'Blog pagination', url: 'blog/?page=2' },
  { type: 'Trades page', url: 'trades/' },
  { type: 'Videos page', url: 'videos/' },
  // Add more specific URLs you want to monitor
];

console.log(`Monitoring indexing status for ${SITE_URL}...`);

/**
 * Check if a URL is indexed using a site: search
 * Note: This is a simplified approach and has limitations
 * For production use, consider using the Google Search Console API
 */
async function checkIndexStatus(urlInfo) {
  return new Promise((resolve) => {
    const searchQuery = encodeURIComponent(`site:${SITE_URL}/${urlInfo.url}`);
    const options = {
      hostname: 'www.google.com',
      path: `/search?q=${searchQuery}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // This is a very simplified check - in production use the Search Console API
        const isIndexed = data.includes(SITE_URL + '/' + urlInfo.url);
        const result = {
          type: urlInfo.type,
          url: `${SITE_URL}/${urlInfo.url}`,
          checked: new Date().toISOString(),
          indexed: isIndexed
        };
        
        console.log(`${result.url}: ${result.indexed ? 'Indexed ✓' : 'Not indexed ✗'}`);
        resolve(result);
      });
    });
    
    req.on('error', (error) => {
      console.error(`Error checking ${urlInfo.url}:`, error);
      resolve({
        type: urlInfo.type,
        url: `${SITE_URL}/${urlInfo.url}`,
        checked: new Date().toISOString(),
        indexed: false,
        error: error.message
      });
    });
    
    req.end();
  });
}

// Check all URLs and generate report
async function generateReport() {
  for (const urlInfo of urlsToCheck) {
    try {
      const result = await checkIndexStatus(urlInfo);
      report.checks.push(result);
      
      // Add a delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(`Error checking ${urlInfo.url}:`, error);
    }
  }
  
  // Compare with previous report
  if (previousReport.checks) {
    report.changes = {
      newlyIndexed: [],
      noLongerIndexed: []
    };
    
    // Find newly indexed URLs
    for (const check of report.checks) {
      const previousCheck = previousReport.checks.find(c => c.url === check.url);
      if (check.indexed && previousCheck && !previousCheck.indexed) {
        report.changes.newlyIndexed.push(check.url);
      }
      if (!check.indexed && previousCheck && previousCheck.indexed) {
        report.changes.noLongerIndexed.push(check.url);
      }
    }
    
    // Log changes
    if (report.changes.newlyIndexed.length > 0) {
      console.log('\nNewly indexed URLs:');
      report.changes.newlyIndexed.forEach(url => console.log(`- ${url}`));
    }
    
    if (report.changes.noLongerIndexed.length > 0) {
      console.log('\nNo longer indexed URLs:');
      report.changes.noLongerIndexed.forEach(url => console.log(`- ${url}`));
    }
  }
  
  // Save report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to ${REPORT_FILE}`);
  
  // Summary
  const indexedCount = report.checks.filter(c => c.indexed).length;
  console.log(`\nSummary: ${indexedCount}/${report.checks.length} URLs indexed (${Math.round(indexedCount/report.checks.length*100)}%)`);
  
  console.log('\nNote: This is a simplified check. For more accurate results, use Google Search Console.');
  console.log('Important: Frequent automated queries to Google may be rate-limited or blocked.');
}

// Run the report
generateReport();
