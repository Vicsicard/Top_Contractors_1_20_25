#!/usr/bin/env node

/**
 * Verify IndexNow Setup
 * 
 * This script checks if your IndexNow setup is correctly configured by:
 * 1. Verifying the key file exists at the expected locations
 * 2. Checking if the key file contains the correct content
 * 3. Testing a sample submission to the IndexNow API
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration - these should match your actual setup
const SITE_URL = 'https://topcontractorsdenver.com';
const API_KEY = 'd9372143285747118f1cf97960c58e11';
const LOCAL_KEY_FILES = [
  path.join(__dirname, '..', 'public', 'indexnow.txt'),
  path.join(__dirname, '..', 'public', `${API_KEY}.txt`)
];
const REMOTE_KEY_LOCATIONS = [
  `${SITE_URL}/indexnow.txt`,
  `${SITE_URL}/${API_KEY}.txt`,
  `${SITE_URL}/.well-known/indexnow.txt`
];

// Parse command line arguments
const args = process.argv.slice(2);
const skipRemoteChecks = args.includes('--local-only');
const testSubmission = args.includes('--test-submission');

/**
 * Check if local key files exist and have correct content
 */
async function checkLocalKeyFiles() {
  console.log('\n=== Checking Local Key Files ===');
  
  for (const filePath of LOCAL_KEY_FILES) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8').trim();
        const isValid = content === API_KEY;
        
        console.log(`✓ Found key file: ${filePath}`);
        console.log(`  Content ${isValid ? 'matches' : 'does NOT match'} expected key`);
        
        if (!isValid) {
          console.log(`  Expected: "${API_KEY}"`);
          console.log(`  Found: "${content}"`);
        }
      } else {
        console.log(`✗ Key file not found: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error checking ${filePath}:`, error.message);
    }
  }
}

/**
 * Fetch a URL and check its content
 */
async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`  Following redirect: ${res.statusCode} -> ${res.headers.location}`);
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Check if remote key files are accessible
 */
async function checkRemoteKeyFiles() {
  console.log('\n=== Checking Remote Key Files ===');
  console.log('This checks if search engines can access your key file.');
  
  for (const url of REMOTE_KEY_LOCATIONS) {
    try {
      console.log(`Checking: ${url}`);
      const response = await fetchUrl(url);
      
      if (response.statusCode === 200) {
        const content = response.data.trim();
        const isValid = content === API_KEY;
        
        console.log(`✓ URL accessible (${response.statusCode})`);
        console.log(`  Content-Type: ${response.headers['content-type'] || 'not specified'}`);
        console.log(`  Content ${isValid ? 'matches' : 'does NOT match'} expected key`);
        
        if (!isValid) {
          console.log(`  Expected: "${API_KEY}"`);
          console.log(`  Found: "${content}"`);
        }
      } else {
        console.log(`✗ URL not accessible: ${response.statusCode} ${response.statusMessage || ''}`);
      }
    } catch (error) {
      console.error(`  Error accessing ${url}:`, error.message);
    }
  }
}

/**
 * Test a sample submission to the IndexNow API
 */
async function testIndexNowSubmission() {
  console.log('\n=== Testing IndexNow API Submission ===');
  
  // Use the homepage URL for testing
  const testUrl = SITE_URL;
  
  const data = JSON.stringify({
    host: new URL(SITE_URL).hostname,
    key: API_KEY,
    keyLocation: `${SITE_URL}/indexnow.txt`,
    urlList: [testUrl]
  });
  
  console.log('Test payload:');
  console.log(data);
  
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
    
    console.log(`Response: ${response.statusCode} ${response.statusMessage || ''}`);
    console.log(`Headers:`, response.headers);
    console.log(`Data: ${response.data}`);
    
    if (response.statusCode === 200) {
      console.log('✓ Test submission successful!');
    } else if (response.statusCode === 403) {
      console.error('✗ Test submission failed with 403 Forbidden');
      console.error('This usually means the key verification failed. Check that:');
      console.error(`1. Your key file is accessible at: ${SITE_URL}/indexnow.txt`);
      console.error(`2. The key file contains exactly: ${API_KEY}`);
    } else {
      console.error(`✗ Test submission failed with status code ${response.statusCode}`);
    }
  } catch (error) {
    console.error('Error during test submission:', error);
  }
}

/**
 * Print summary and recommendations
 */
function printSummary() {
  console.log('\n=== Summary and Recommendations ===');
  console.log('1. Make sure your key file is accessible at:');
  console.log(`   - ${SITE_URL}/indexnow.txt (primary location)`);
  console.log(`   - ${SITE_URL}/${API_KEY}.txt (alternative location)`);
  console.log('2. The key file should contain ONLY the key, no extra whitespace or HTML.');
  console.log('3. The Content-Type should be text/plain.');
  console.log('4. If using Next.js, ensure your API routes are correctly configured.');
  console.log('\nFor more information, see:');
  console.log('https://www.indexnow.org/documentation');
}

/**
 * Main function
 */
async function main() {
  console.log('IndexNow Setup Verification');
  console.log('==========================');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`API Key: ${API_KEY}`);
  
  await checkLocalKeyFiles();
  
  if (!skipRemoteChecks) {
    await checkRemoteKeyFiles();
  }
  
  if (testSubmission) {
    await testIndexNowSubmission();
  }
  
  printSummary();
}

// Run the script
main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
