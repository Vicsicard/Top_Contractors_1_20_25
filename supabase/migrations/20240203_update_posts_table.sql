-- Update posts table to include all necessary columns
ALTER TABLE posts 
  ADD COLUMN IF NOT EXISTS hashnode_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS brief text,
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS tags text[];

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_hashnode_id ON posts(hashnode_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
