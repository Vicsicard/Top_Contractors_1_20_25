-- LEADS TABLE SETUP - Copy and paste this entire file into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/bmiyyaexngxbrzkyqgzk/sql

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads(status);
CREATE INDEX IF NOT EXISTS leads_zip_code_idx ON public.leads(zip_code);
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads(email);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists (prevents errors on re-run)
DROP POLICY IF EXISTS "Service role can manage all leads" ON public.leads;

-- Create policy for API access
CREATE POLICY "Service role can manage all leads"
  ON public.leads
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify table was created (should return empty result)
SELECT * FROM public.leads LIMIT 1;
