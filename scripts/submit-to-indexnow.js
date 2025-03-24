#!/usr/bin/env node

/**
 * Submit URLs to IndexNow
 * 
 * This script reads URLs from your sitemap and submits them to IndexNow,
 * which will notify multiple search engines at once (Bing, Yandex, etc.)
 * 
 * Usage:
 *   node submit-to-indexnow.js [--all] [--modified-since=YYYY-MM-DD] [--local]
 * 
 * Options:
 *   --all                  Submit all URLs from the sitemap
 *   --modified-since=DATE  Only submit URLs modified since the specified date
 *   --local                Use local sitemap files instead of fetching from the live site
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://topcontractorsdenver.com';
const API_KEY = 'd9372143285747118f1cf97960c58e11'; // Your IndexNow API key
const SITEMAPS_REMOTE = [
  `${SITE_URL}/sitemap.xml`,
  `${SITE_URL}/sitemap-blog.xml`,
  `${SITE_URL}/sitemap-static.xml`,
  `${SITE_URL}/sitemap-trades.xml`,
  `${SITE_URL}/sitemap-videos.xml`
];
const SITEMAPS_LOCAL = [
  path.join(__dirname, '..', 'public', 'sitemap.xml'),
  path.join(__dirname, '..', 'public', 'sitemap-blog.xml'),
  path.join(__dirname, '..', 'public', 'sitemap-static.xml'),
  path.join(__dirname, '..', 'public', 'sitemap-trades.xml'),
  path.join(__dirname, '..', 'public', 'sitemap-videos.xml')
];

// Parse command line arguments
const args = process.argv.slice(2);
const submitAll = args.includes('--all');
const useLocalSitemaps = args.includes('--local'); // Only use local sitemaps if explicitly requested
let modifiedSince = null;

for (const arg of args) {
  if (arg.startsWith('--modified-since=')) {
    modifiedSince = new Date(arg.split('=')[1]);
    if (isNaN(modifiedSince.getTime())) {
      console.error('Invalid date format. Use YYYY-MM-DD');
      process.exit(1);
    }
  }
}

// If neither --all nor --modified-since is specified, default to last 7 days
if (!submitAll && !modifiedSince) {
  modifiedSince = new Date();
  modifiedSince.setDate(modifiedSince.getDate() - 7);
  console.log(`No date specified. Using last 7 days (since ${modifiedSince.toISOString().split('T')[0]})`);
}

/**
 * Fetch a sitemap XML file from a URL, following redirects
 */
async function fetchSitemapRemote(url, maxRedirects = 5) {
  console.log(`Fetching remote sitemap: ${url}`);
  
  return new Promise((resolve, reject) => {
    const request = (url, redirectsLeft) => {
      if (redirectsLeft <= 0) {
        reject(new Error('Too many redirects'));
        return;
      }
      
      https.get(url, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log(`Following redirect: ${res.statusCode} -> ${res.headers.location}`);
          
          // Handle relative URLs in location header
          let redirectUrl = res.headers.location;
          if (redirectUrl.startsWith('/')) {
            const baseUrl = new URL(url);
            redirectUrl = `${baseUrl.protocol}//${baseUrl.host}${redirectUrl}`;
          }
          
          request(redirectUrl, redirectsLeft - 1);
          return;
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch sitemap: ${res.statusCode} ${res.statusMessage}`));
          return;
        }
        
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      }).on('error', (err) => {
        reject(err);
      });
    };
    
    request(url, maxRedirects);
  });
}

/**
 * Read a sitemap XML file from the local filesystem
 */
async function fetchSitemapLocal(filePath) {
  console.log(`Reading local sitemap: ${filePath}`);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}

/**
 * Parse a sitemap XML string using regex (more reliable than xml2js for this specific case)
 */
function parseSitemapWithRegex(xmlData) {
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  const lastmodRegex = /<lastmod>(.*?)<\/lastmod>/g;
  
  let locMatch;
  let lastmodMatch;
  
  const locMatches = [];
  const lastmodMatches = [];
  
  while ((locMatch = locRegex.exec(xmlData)) !== null) {
    locMatches.push(locMatch[1]);
  }
  
  while ((lastmodMatch = lastmodRegex.exec(xmlData)) !== null) {
    lastmodMatches.push(lastmodMatch[1]);
  }
  
  for (let i = 0; i < locMatches.length; i++) {
    urls.push({
      loc: locMatches[i],
      lastmod: lastmodMatches[i] ? new Date(lastmodMatches[i]) : null
    });
  }
  
  return urls;
}

/**
 * Check if the XML is a sitemap index and extract sitemap URLs
 */
function extractSitemapsFromIndex(xmlData) {
  if (!xmlData.includes('<sitemapindex')) {
    return null;
  }
  
  const sitemapUrls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  
  let locMatch;
  while ((locMatch = locRegex.exec(xmlData)) !== null) {
    sitemapUrls.push(locMatch[1]);
  }
  
  return sitemapUrls;
}

/**
 * Filter URLs by modification date
 */
function filterUrlsByDate(urls, date) {
  if (!date) return urls.map(url => url.loc);
  
  return urls
    .filter(url => url.lastmod && url.lastmod >= date)
    .map(url => url.loc);
}

/**
 * Submit URLs to IndexNow API
 */
async function submitToIndexNow(urls) {
  // IndexNow allows up to 10,000 URLs per request, but we'll chunk into smaller batches
  const MAX_URLS_PER_REQUEST = 100;
  const chunks = [];
  
  for (let i = 0; i < urls.length; i += MAX_URLS_PER_REQUEST) {
    chunks.push(urls.slice(i, i + MAX_URLS_PER_REQUEST));
  }
  
  console.log(`Submitting ${urls.length} URLs in ${chunks.length} batches`);
  console.log(`Using key: ${API_KEY}`);
  console.log(`Key location: ${SITE_URL}/indexnow.txt`);
  
  for (let i = 0; i < chunks.length; i++) {
    const urlList = chunks[i];
    console.log(`Submitting batch ${i+1}/${chunks.length} (${urlList.length} URLs)`);
    
    const data = JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: API_KEY,
      keyLocation: `${SITE_URL}/indexnow.txt`,
      urlList
    });
    
    // Log the payload for debugging (first batch only)
    if (i === 0) {
      console.log('Sample payload:');
      console.log(JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: API_KEY,
        keyLocation: `${SITE_URL}/indexnow.txt`,
        urlList: urlList.slice(0, 2) // Just show first 2 URLs as sample
      }, null, 2));
    }
    
    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': data.length,
        'User-Agent': 'TopContractorsDenver/1.0'
      }
    };
    
    try {
      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let responseData = '';
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode,
              statusMessage: res.statusMessage,
              headers: res.headers,
              data: responseData
            });
          });
        });
        
        req.on('error', (error) => {
          reject(error);
        });
        
        req.write(data);
        req.end();
      });
      
      console.log(`Batch ${i+1} response: ${response.statusCode} ${response.statusMessage}`);
      console.log(`Response headers:`, response.headers);
      console.log(`Response data: ${response.data}`);
      
      // If we get a 403 Forbidden, provide more detailed troubleshooting info
      if (response.statusCode === 403) {
        console.error('ERROR: Received 403 Forbidden response from IndexNow API');
        console.error('This usually means the key verification failed. Check that:');
        console.error(`1. Your key file is accessible at: ${SITE_URL}/indexnow.txt`);
        console.error(`2. The key file contains exactly: ${API_KEY}`);
        console.error(`3. Try visiting ${SITE_URL}/indexnow.txt in your browser to verify it works`);
      }
      
      // Add a small delay between batches to avoid rate limiting
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Error submitting batch ${i+1}:`, error);
    }
  }
}

/**
 * Process a sitemap URL or file
 */
async function processSitemap(sitemapPath, isLocal) {
  try {
    let xmlData;
    
    if (isLocal) {
      xmlData = await fetchSitemapLocal(sitemapPath);
    } else {
      xmlData = await fetchSitemapRemote(sitemapPath);
    }
    
    // Check if this is a sitemap index
    const nestedSitemaps = extractSitemapsFromIndex(xmlData);
    if (nestedSitemaps) {
      console.log(`Found sitemap index with ${nestedSitemaps.length} sitemaps`);
      let allUrls = [];
      
      for (const nestedSitemapUrl of nestedSitemaps) {
        try {
          const nestedXmlData = await fetchSitemapRemote(nestedSitemapUrl);
          const sitemap = parseSitemapWithRegex(nestedXmlData);
          console.log(`Found ${sitemap.length} URLs in nested sitemap: ${nestedSitemapUrl}`);
          
          const filteredUrls = filterUrlsByDate(sitemap, modifiedSince);
          console.log(`${filteredUrls.length} URLs ${modifiedSince ? 'modified since ' + modifiedSince.toISOString().split('T')[0] : 'total'}`);
          
          allUrls = allUrls.concat(filteredUrls);
        } catch (error) {
          console.error(`Error processing nested sitemap ${nestedSitemapUrl}:`, error);
        }
      }
      
      return allUrls;
    } else {
      // Regular sitemap
      const sitemap = parseSitemapWithRegex(xmlData);
      console.log(`Found ${sitemap.length} URLs in sitemap`);
      
      const filteredUrls = filterUrlsByDate(sitemap, modifiedSince);
      console.log(`${filteredUrls.length} URLs ${modifiedSince ? 'modified since ' + modifiedSince.toISOString().split('T')[0] : 'total'}`);
      
      return filteredUrls;
    }
  } catch (error) {
    console.error(`Error processing sitemap ${sitemapPath}:`, error);
    return [];
  }
}

/**
 * Main function
 */
async function main() {
  let allUrls = [];
  const sitemaps = useLocalSitemaps ? SITEMAPS_LOCAL : SITEMAPS_REMOTE;
  
  console.log(`Using ${useLocalSitemaps ? 'local' : 'remote'} sitemaps`);
  
  for (const sitemapPath of sitemaps) {
    const urls = await processSitemap(sitemapPath, useLocalSitemaps);
    allUrls = allUrls.concat(urls);
  }
  
  // Remove duplicate URLs
  allUrls = [...new Set(allUrls)];
  
  if (allUrls.length > 0) {
    console.log(`Submitting ${allUrls.length} unique URLs to IndexNow`);
    await submitToIndexNow(allUrls);
    console.log('Submission complete');
  } else {
    console.log('No URLs to submit');
  }
}

// Run the script
main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
