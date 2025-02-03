-- Create posts table
BEGIN;

CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    html TEXT NOT NULL,
    excerpt TEXT,
    feature_image TEXT,
    feature_image_alt TEXT,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    reading_time INTEGER,
    trade_category TEXT,
    authors JSONB[], -- Store authors as JSON array
    tags JSONB[] -- Store tags as JSON array
);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
    DROP POLICY IF EXISTS "Enable insert/update for service role only" ON posts;
    
    CREATE POLICY "Enable read access for all users" ON posts
        FOR SELECT USING (true);

    CREATE POLICY "Enable insert/update for service role only" ON posts
        FOR ALL USING (auth.role() = 'service_role');
END $$;

-- Create indexes
DROP INDEX IF EXISTS idx_posts_slug;
DROP INDEX IF EXISTS idx_posts_trade_category;
DROP INDEX IF EXISTS idx_posts_published_at;

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_trade_category ON posts(trade_category);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);

COMMIT;

-- Instructions:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Create a new query
-- 5. Paste this SQL
-- 6. Run the query
