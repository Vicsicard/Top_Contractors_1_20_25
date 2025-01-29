-- Create videos table
create table if not exists videos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  youtube_id text not null,
  category text not null,
  timestamps jsonb,
  transcript text,
  related_services text[],
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for common queries
create index if not exists videos_category_idx on videos(category);
create index if not exists videos_youtube_id_idx on videos(youtube_id);

-- Add RLS policies
alter table videos enable row level security;

-- Allow public read access
create policy "Allow public read access on videos"
  on videos for select
  to public
  using (true);

-- Allow authenticated users to insert/update/delete
create policy "Allow authenticated users to manage videos"
  on videos for all
  to authenticated
  using (true)
  with check (true);
