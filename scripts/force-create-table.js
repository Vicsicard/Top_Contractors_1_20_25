const https = require('https');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
const supabaseKey = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY;

// Create table by inserting a test record (will create table if not exists)
// Then delete the test record

async function createTableViaInsert() {
  console.log('Creating leads table via Supabase API...\n');

  // First, try to query the table to see if it exists
  const checkOptions = {
    hostname: 'bmiyyaexngxbrzkyqgzk.supabase.co',
    path: '/rest/v1/leads?select=id&limit=1',
    method: 'GET',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(checkOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Table "leads" already exists and is accessible!\n');
          resolve(true);
        } else if (res.statusCode === 404 || data.includes('does not exist')) {
          console.log('❌ Table does not exist. Cannot create via REST API.\n');
          console.log('Supabase requires SQL Editor for table creation.');
          console.log('\n📋 Quick Setup:');
          console.log('1. Go to: https://supabase.com/dashboard/project/bmiyyaexngxbrzkyqgzk/sql');
          console.log('2. Copy contents of QUICK_DB_SETUP.sql');
          console.log('3. Paste and click RUN');
          console.log('4. Done in 30 seconds!\n');
          resolve(false);
        } else {
          console.log('Response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

createTableViaInsert().catch(console.error);
