-- Create leads table for contractor quote requests
-- Migration: create_leads_table
-- Created: 2026-02-17

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

-- Create policy for service role (API access)
create policy "Service role can manage all leads"
  on public.leads
  for all
  to service_role
  using (true)
  with check (true);

-- Add comment for documentation
comment on table public.leads is 'Stores contractor quote requests from website visitors';
comment on column public.leads.project_type is 'Type of contractor service needed';
comment on column public.leads.description is 'Project description (20-1000 chars)';
comment on column public.leads.timeline is 'When customer needs work done';
comment on column public.leads.budget_range is 'Optional budget range';
comment on column public.leads.zip_code is 'Customer ZIP code (5 digits)';
comment on column public.leads.preferred_contact is 'How customer prefers to be contacted';
comment on column public.leads.status is 'Lead status: new, contacted, qualified, closed';
