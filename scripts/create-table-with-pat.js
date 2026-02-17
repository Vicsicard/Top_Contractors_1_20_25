const https = require('https');
require('dotenv').config({ path: '.env.local' });

const projectRef = 'bmiyyaexngxbrzkyqgzk';
const pat = process.env.SUPABASE_ACCESS_TOKEN;

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
  console.log('Creating leads table via Supabase Management API...\n');

  const body = JSON.stringify({ query: sql });

  const result = await makeRequest({
    hostname: 'api.supabase.com',
    path: `/v1/projects/${projectRef}/database/query`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${pat}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);

  console.log('Status:', result.status);
  console.log('Response:', result.body);

  if (result.status === 200 || result.status === 201) {
    console.log('\n✅ Table created successfully!\n');
  } else {
    // Try alternate endpoint
    console.log('\nTrying alternate endpoint...');
    const result2 = await makeRequest({
      hostname: 'api.supabase.com',
      path: `/v1/projects/${projectRef}/db/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, body);
    console.log('Status:', result2.status);
    console.log('Response:', result2.body);
  }

  // Verify table
  const serviceKey = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY;
  const check = await makeRequest({
    hostname: `${projectRef}.supabase.co`,
    path: '/rest/v1/leads?select=id&limit=1',
    method: 'GET',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    }
  }, null);

  if (check.status === 200) {
    console.log('\n✅ CONFIRMED: Table "leads" exists and is accessible!');
    console.log('🚀 Database is ready for production!\n');
  } else {
    console.log('\n❌ Table not yet accessible. Status:', check.status);
  }
}

run().catch(console.error);
