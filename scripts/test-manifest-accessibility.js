/**
 * Test manifest.json accessibility
 * 
 * This script checks if the manifest.json file and its referenced resources
 * are accessible and properly configured.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000'; // Use your local development URL
const MANIFEST_PATH = path.join(__dirname, '../public/manifest.json');

// Helper function to check URL accessibility
function checkUrl(url) {
  return new Promise((resolve, reject) => {
    console.log(`Checking URL: ${url}`);
    
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve({
          url,
          status: res.statusCode,
          success: true
        });
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        console.log(`Redirect to: ${res.headers.location}`);
        resolve({
          url,
          status: res.statusCode,
          redirect: res.headers.location,
          success: false
        });
      } else {
        resolve({
          url,
          status: res.statusCode,
          success: false
        });
      }
    });
    
    req.on('error', (error) => {
      console.error(`Error checking ${url}:`, error.message);
      resolve({
        url,
        error: error.message,
        success: false
      });
    });
    
    req.end();
  });
}

// Main function
async function testManifestAccessibility() {
  console.log('Testing manifest.json accessibility...');
  
  // Check if manifest.json exists locally
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('Error: manifest.json not found in public directory');
    return;
  }
  
  // Read and parse manifest.json
  const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
  let manifest;
  
  try {
    manifest = JSON.parse(manifestContent);
    console.log('✓ manifest.json is valid JSON');
  } catch (error) {
    console.error('Error parsing manifest.json:', error.message);
    return;
  }
  
  // Check manifest.json URL
  const manifestUrl = `${BASE_URL}/manifest.json`;
  const manifestResult = await checkUrl(manifestUrl);
  
  // Check icons
  const iconResults = [];
  
  if (manifest.icons && Array.isArray(manifest.icons)) {
    console.log(`\nChecking ${manifest.icons.length} icons...`);
    
    for (const icon of manifest.icons) {
      if (icon.src) {
        const iconUrl = new URL(icon.src, BASE_URL).href;
        const result = await checkUrl(iconUrl);
        iconResults.push({
          ...result,
          sizes: icon.sizes,
          type: icon.type
        });
      }
    }
  } else {
    console.warn('Warning: No icons defined in manifest.json');
  }
  
  // Print summary
  console.log('\n--- SUMMARY ---');
  console.log(`Manifest: ${manifestResult.success ? '✓' : '✗'} ${manifestUrl} (${manifestResult.status || manifestResult.error})`);
  
  console.log('\nIcons:');
  iconResults.forEach(result => {
    console.log(`${result.success ? '✓' : '✗'} ${result.url} (${result.status || result.error}) - ${result.type} ${result.sizes}`);
  });
  
  // Check if there are any issues
  const hasIssues = !manifestResult.success || iconResults.some(r => !r.success);
  
  if (hasIssues) {
    console.log('\n⚠️ Some issues were detected. Please fix them to ensure proper PWA functionality.');
  } else {
    console.log('\n✅ All manifest resources are accessible!');
  }
}

// Run the test
testManifestAccessibility().catch(console.error);
