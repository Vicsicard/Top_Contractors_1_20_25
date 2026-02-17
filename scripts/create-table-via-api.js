const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
const supabaseKey = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

async function createTable() {
  console.log('Creating leads table via Supabase Management API...\n');

  // Use Supabase Management API to execute SQL
  const projectRef = 'bmiyyaexngxbrzkyqgzk'; // From URL
  
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

CREATE POLICY "Service role can manage all leads"
  ON public.leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
`;

  try {
    // Use Supabase client to execute raw SQL via rpc
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try using pg_catalog to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        query: sql
      })
    });

    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response:', result);

    // Verify table exists
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Table verification failed:', error.message);
      console.log('\nTable creation may have failed. Using SQL file instead.');
      process.exit(1);
    } else {
      console.log('\n✅ Table created and verified successfully!');
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createTable();
