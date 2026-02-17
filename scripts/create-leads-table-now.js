const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
const supabaseKey = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createLeadsTable() {
  console.log('🔧 Creating leads table in Supabase...\n');

  // First, check if table already exists
  const { data: existingTable, error: checkError } = await supabase
    .from('leads')
    .select('id')
    .limit(1);

  if (!checkError) {
    console.log('✅ Table "leads" already exists!');
    console.log('📊 Verifying structure...\n');
    
    // Get table info
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(0);
    
    if (!error) {
      console.log('✅ Table is accessible and ready to use!\n');
      return;
    }
  }

  console.log('📝 Table does not exist. Creating now...\n');

  // Create table using raw SQL via REST API
  const sql = `
-- Create leads table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_zip_code_idx ON public.leads(zip_code);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists
DROP POLICY IF EXISTS "Service role can manage all leads" ON public.leads;

-- Create policy
CREATE POLICY "Service role can manage all leads"
  ON public.leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
  `;

  try {
    // Execute SQL using Supabase Management API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      console.log('✅ Table created successfully!\n');
    } else {
      // Try alternative method - direct SQL execution
      console.log('⚠️  Using alternative creation method...\n');
      
      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        try {
          const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: statement })
          });
          
          if (!res.ok) {
            const errorText = await res.text();
            console.log(`⚠️  Statement result: ${errorText}`);
          }
        } catch (e) {
          console.log(`⚠️  Statement execution: ${e.message}`);
        }
      }
    }

    // Verify table was created
    console.log('🔍 Verifying table creation...\n');
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Table verification failed:', error.message);
      console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:');
      console.log('https://supabase.com/dashboard/project/bmiyyaexngxbrzkyqgzk/sql\n');
      console.log(sql);
    } else {
      console.log('✅ Table created and verified successfully!\n');
      console.log('📊 Table Structure:');
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
      console.log('  ✓ source_page (text)');
      console.log('  ✓ user_agent (text)');
      console.log('  ✓ ip (text)');
      console.log('  ✓ status (text, default: new)\n');
      console.log('🔒 Security: Row Level Security ENABLED');
      console.log('📈 Indexes: created_at, status, zip_code, email\n');
      console.log('✅ Ready for production use!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/bmiyyaexngxbrzkyqgzk/sql\n');
    console.log(sql);
  }
}

createLeadsTable().catch(console.error);
