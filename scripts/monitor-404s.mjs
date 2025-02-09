import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const SITE_URL = 'https://topcontractorsdenver.com';
const LOG_DIR = path.join(process.cwd(), 'logs');
const ERROR_LOG = path.join(LOG_DIR, '404-errors.json');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

// Load existing errors
let existingErrors = {};
if (fs.existsSync(ERROR_LOG)) {
  existingErrors = JSON.parse(fs.readFileSync(ERROR_LOG, 'utf-8'));
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      url,
      status: response.status,
      ok: response.ok
    };
  } catch (error) {
    return {
      url,
      status: 'error',
      error: error.message
    };
  }
}

async function monitorUrls() {
  // Read all sitemaps
  const sitemaps = [
    'sitemap-static.xml',
    'sitemap-blog.xml',
    'sitemap-trades.xml',
    'sitemap-videos.xml'
  ];

  const errors = {};
  const timestamp = new Date().toISOString();

  for (const sitemap of sitemaps) {
    const sitemapPath = path.join(process.cwd(), 'public', sitemap);
    if (!fs.existsSync(sitemapPath)) {
      console.warn(`Warning: ${sitemap} not found`);
      continue;
    }

    const content = fs.readFileSync(sitemapPath, 'utf-8');
    const urls = content.match(/<loc>(.*?)<\/loc>/g)
      ?.map(loc => loc.replace(/<\/?loc>/g, '')) || [];

    console.log(`Checking ${urls.length} URLs from ${sitemap}...`);

    for (const url of urls) {
      const result = await checkUrl(url);
      if (!result.ok) {
        errors[url] = {
          status: result.status,
          error: result.error,
          firstSeen: existingErrors[url]?.firstSeen || timestamp,
          lastChecked: timestamp
        };
      }
    }
  }

  // Save errors to log file
  fs.writeFileSync(ERROR_LOG, JSON.stringify(errors, null, 2));

  // Generate report
  const newErrors = Object.keys(errors).filter(url => !existingErrors[url]);
  const resolvedErrors = Object.keys(existingErrors).filter(url => !errors[url]);

  console.log('\nError Report:');
  console.log('=============');
  console.log(`Total Errors: ${Object.keys(errors).length}`);
  console.log(`New Errors: ${newErrors.length}`);
  console.log(`Resolved Errors: ${resolvedErrors.length}`);

  if (newErrors.length > 0) {
    console.log('\nNew Errors:');
    newErrors.forEach(url => {
      console.log(`- ${url} (${errors[url].status})`);
    });
  }

  if (resolvedErrors.length > 0) {
    console.log('\nResolved Errors:');
    resolvedErrors.forEach(url => {
      console.log(`- ${url}`);
    });
  }
}

monitorUrls().catch(console.error);
