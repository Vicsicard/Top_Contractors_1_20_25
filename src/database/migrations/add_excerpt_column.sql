-- Add excerpt column to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add comment for documentation
COMMENT ON COLUMN posts.excerpt IS 'Short excerpt or summary of the post content';
