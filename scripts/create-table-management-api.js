const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Using Supabase Management API to execute SQL
const projectRef = 'bmiyyaexngxbrzkyqgzk';
const sql = fs.readFileSync('QUICK_DB_SETUP.sql', 'utf-8');

async function createTableViaManagementAPI() {
  console.log('Creating leads table via Supabase Management API...\n');
  console.log('Note: This requires a Personal Access Token from Supabase.\n');
  
  // Check for PAT in environment
  const pat = process.env.SUPABASE_ACCESS_TOKEN;
  
  if (!pat) {
    console.log('❌ Missing SUPABASE_ACCESS_TOKEN in .env.local\n');
    console.log('To get a Personal Access Token:');
    console.log('1. Go to: https://supabase.com/dashboard/account/tokens');
    console.log('2. Click "Generate new token"');
    console.log('3. Copy the token');
    console.log('4. Add to .env.local: SUPABASE_ACCESS_TOKEN=sbp_...\n');
    console.log('Alternative: Use SQL Editor (30 seconds)');
    console.log('https://supabase.com/dashboard/project/bmiyyaexngxbrzkyqgzk/sql\n');
    process.exit(1);
  }

  // Use Management API to execute SQL
  const options = {
    hostname: 'api.supabase.com',
    path: `/v1/projects/${projectRef}/database/query`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${pat}`,
      'Content-Type': 'application/json'
    }
  };

  const postData = JSON.stringify({
    query: sql
  });

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Table created successfully via Management API!\n');
          console.log('📊 Leads table is now ready for production use.\n');
          resolve(true);
        } else {
          console.log(`❌ API returned status ${res.statusCode}`);
          console.log('Response:', data);
          console.log('\nFalling back to SQL Editor method.');
          console.log('Copy QUICK_DB_SETUP.sql and paste here:');
          console.log('https://supabase.com/dashboard/project/bmiyyaexngxbrzkyqgzk/sql\n');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

createTableViaManagementAPI().catch(console.error);
