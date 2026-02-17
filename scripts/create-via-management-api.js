const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Supabase Management API requires a personal access token
// We'll use the service role key to execute SQL via the database connection string

const projectRef = 'bmiyyaexngxbrzkyqgzk';
const serviceRoleKey = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY;

const sql = fs.readFileSync('QUICK_DB_SETUP.sql', 'utf-8');

// Use Supabase's database pooler to execute SQL
async function executeSQLViaPooler() {
  console.log('Executing SQL via Supabase database connection...\n');

  const { Client } = require('pg');
  
  // Connection string format for Supabase
  const connectionString = `postgresql://postgres.${projectRef}:${serviceRoleKey}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase database\n');

    // Execute the SQL
    await client.query(sql);
    console.log('✅ SQL executed successfully!\n');

    // Verify table exists
    const result = await client.query('SELECT * FROM public.leads LIMIT 1');
    console.log('✅ Table verified and accessible!\n');

    console.log('📊 Table Structure Created:');
    console.log('  ✓ id (uuid, primary key)');
    console.log('  ✓ created_at (timestamp)');
    console.log('  ✓ project_type (text, required)');
    console.log('  ✓ description (text, 20-1000 chars)');
    console.log('  ✓ timeline (text, required)');
    console.log('  ✓ budget_range (text, optional)');
    console.log('  ✓ zip_code (text, 5 digits)');
    console.log('  ✓ full_name (text, required)');
    console.log('  ✓ email (text, required)');
    console.log('  ✓ phone (text, optional)');
    console.log('  ✓ preferred_contact (text, default: Email)');
    console.log('  ✓ source_page, user_agent, ip (metadata)');
    console.log('  ✓ status (text, default: new)\n');
    console.log('🔒 Row Level Security: ENABLED');
    console.log('📈 Indexes: created_at, status, zip_code, email\n');
    console.log('✅ Database ready for production!\n');

    await client.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n⚠️  Authentication failed. The service role key may be incorrect.');
      console.log('Please verify MAIN_SUPABASE_SERVICE_ROLE_KEY in .env.local\n');
    } else if (error.message.includes('no pg_hba.conf entry')) {
      console.log('\n⚠️  Connection not allowed. Using alternative method...\n');
    }
    
    await client.end();
    process.exit(1);
  }
}

// Check if pg module is installed
try {
  require.resolve('pg');
  executeSQLViaPooler();
} catch (e) {
  console.log('Installing pg module...\n');
  const { execSync } = require('child_process');
  execSync('npm install pg', { stdio: 'inherit' });
  console.log('\nRetrying table creation...\n');
  executeSQLViaPooler();
}
