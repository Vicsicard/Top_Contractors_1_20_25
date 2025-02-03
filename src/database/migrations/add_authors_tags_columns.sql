-- Add authors and tags columns to posts table
alter table posts 
add column if not exists authors jsonb default '[]'::jsonb,
add column if not exists tags jsonb default '[]'::jsonb;

-- Add comments to explain the new columns
comment on column posts.authors is 'Array of author objects in JSONB format';
comment on column posts.tags is 'Array of tag objects in JSONB format';
