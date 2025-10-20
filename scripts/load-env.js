/**
 * Cross-platform environment variable loader
 * 
 * This script loads environment variables from .env.local and makes them available
 * for both CommonJS and ESM scripts.
 */

const fs = require('fs');
const path = require('path');

// Path to .env.local file
const envPath = path.resolve(__dirname, '../.env.local');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.error(`Error: .env.local file not found at ${envPath}`);
  process.exit(1);
}

// Read and parse .env.local file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse each line
envContent.split('\n').forEach(line => {
  // Skip comments and empty lines
  if (!line || line.startsWith('#')) return;
  
  // Parse key=value pairs
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    
    // Remove quotes if present
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    
    // Set environment variable
    process.env[key] = value;
    envVars[key] = value;
  }
});

// Log loaded variables (without showing actual values for security)
console.log('Environment variables loaded:');
Object.keys(envVars).forEach(key => {
  console.log(`- ${key}: ${key.includes('KEY') ? '********' : '✓ Set'}`);
});

// Export for ESM modules
module.exports = envVars;
