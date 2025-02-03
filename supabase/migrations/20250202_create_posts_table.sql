-- Create posts table
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
CREATE POLICY "Enable read access for all users" ON posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert/update for service role only" ON posts
    FOR ALL USING (auth.role() = 'service_role');

-- Create indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_trade_category ON posts(trade_category);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
