const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
const supabaseKey = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_MAIN_SUPABASE_URL and MAIN_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupLeadsTable() {
  console.log('🔧 Setting up leads table in Supabase...\n');

  const sql = `
-- Create leads table for contractor quote requests
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Project details
  project_type text not null,
  description text not null check (char_length(description) between 20 and 1000),
  timeline text not null,
  budget_range text,

  -- Location
  zip_code text not null check (char_length(zip_code) = 5),

  -- Contact information
  full_name text not null,
  email text not null,
  phone text,
  preferred_contact text not null default 'Email',

  -- Metadata
  source_page text,
  user_agent text,
  ip text,

  -- Status tracking
  status text default 'new'
);

-- Create indexes for performance
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_zip_code_idx on public.leads(zip_code);
create index if not exists leads_email_idx on public.leads(email);

-- Enable Row Level Security
alter table public.leads enable row level security;

-- Drop existing policy if it exists
drop policy if exists "Service role can manage all leads" on public.leads;

-- Create policy for service role (API access)
create policy "Service role can manage all leads"
  on public.leads
  for all
  to service_role
  using (true)
  with check (true);
  `;

  try {
    // Execute the SQL using Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      // If RPC doesn't work, try direct SQL execution via Supabase client
      console.log('⚠️  RPC method not available, using alternative approach...\n');
      console.log('📋 Please run this SQL manually in Supabase SQL Editor:\n');
      console.log('─'.repeat(60));
      console.log(sql);
      console.log('─'.repeat(60));
      console.log('\nSteps:');
      console.log('1. Go to: https://supabase.com/dashboard/project/bmiyyaexngxbrzkyqgzk/sql');
      console.log('2. Copy the SQL above');
      console.log('3. Paste into SQL Editor');
      console.log('4. Click "Run"');
      console.log('5. Verify table appears in Table Editor\n');
      return;
    }

    console.log('✅ Leads table created successfully!\n');
    
    // Verify table exists
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    if (error) {
      console.log('⚠️  Table created but verification failed:', error.message);
      console.log('Please check Supabase Table Editor manually.\n');
    } else {
      console.log('✅ Table verified and accessible!\n');
    }

    console.log('📊 Table Structure:');
    console.log('  - id (uuid, primary key)');
    console.log('  - created_at (timestamp)');
    console.log('  - project_type (text)');
    console.log('  - description (text, 20-1000 chars)');
    console.log('  - timeline (text)');
    console.log('  - budget_range (text, optional)');
    console.log('  - zip_code (text, 5 digits)');
    console.log('  - full_name (text)');
    console.log('  - email (text)');
    console.log('  - phone (text, optional)');
    console.log('  - preferred_contact (text, default: Email)');
    console.log('  - source_page (text)');
    console.log('  - user_agent (text)');
    console.log('  - ip (text)');
    console.log('  - status (text, default: new)\n');

    console.log('🔒 Security:');
    console.log('  - Row Level Security: ENABLED');
    console.log('  - Service role policy: CREATED\n');

    console.log('📈 Indexes:');
    console.log('  - created_at (desc)');
    console.log('  - status');
    console.log('  - zip_code');
    console.log('  - email\n');

  } catch (error) {
    console.error('❌ Error setting up table:', error.message);
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:\n');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
  }
}

setupLeadsTable();
