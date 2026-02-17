const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = 'bmiyyaexngxbrzkyqgzk';
const serviceRoleKey = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY;

const sql = `
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  project_type text NOT NULL,
  description text NOT NULL CHECK (char_length(description) BETWEEN 20 AND 1000),
  timeline text NOT NULL,
  budget_range text,
  zip_code text NOT NULL CHECK (char_length(zip_code) = 5),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  preferred_contact text NOT NULL DEFAULT 'Email',
  source_page text,
  user_agent text,
  ip text,
  status text DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_zip_code_idx ON public.leads(zip_code);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage all leads" ON public.leads;
CREATE POLICY "Service role can manage all leads" ON public.leads FOR ALL TO service_role USING (true) WITH CHECK (true);
`;

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function run() {
  console.log('Attempting to create leads table via Supabase API...\n');

  // Try the pg endpoint (available in some Supabase versions)
  const endpoints = [
    `/rest/v1/rpc/exec`,
    `/rest/v1/rpc/run_sql`,
    `/rest/v1/rpc/execute_sql`,
    `/pg/query`,
  ];

  for (const path of endpoints) {
    const body = JSON.stringify({ query: sql, sql });
    const result = await makeRequest({
      hostname: `${supabaseUrl}.supabase.co`,
      path,
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, body);

    console.log(`${path}: ${result.status}`);
    if (result.status === 200 || result.status === 201) {
      console.log('✅ SUCCESS via', path);
      break;
    }
  }

  // Verify table exists
  const check = await makeRequest({
    hostname: `${supabaseUrl}.supabase.co`,
    path: '/rest/v1/leads?select=id&limit=1',
    method: 'GET',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    }
  }, null);

  if (check.status === 200) {
    console.log('\n✅ Table "leads" exists and is accessible!');
  } else {
    console.log('\n❌ Table does not exist yet. Status:', check.status);
    console.log('Response:', check.body);
    console.log('\n⚠️  The Supabase REST API does not support DDL via HTTP.');
    console.log('A Personal Access Token is required for the Management API.');
    console.log('\nTo get one:');
    console.log('1. Go to: https://supabase.com/dashboard/account/tokens');
    console.log('2. Generate a new token');
    console.log('3. Add to .env.local: SUPABASE_ACCESS_TOKEN=sbp_...');
    console.log('4. Run: node scripts/execute-sql-api.js\n');
  }
}

run().catch(console.error);
