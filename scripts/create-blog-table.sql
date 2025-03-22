-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    tags TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    category TEXT NOT NULL,
    preview TEXT NOT NULL,
    
    -- Add constraints
    CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON public.blog_posts(created_at);

-- Add RLS policies
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read blog posts
CREATE POLICY "Allow public read access" ON public.blog_posts
    FOR SELECT
    TO public
    USING (true);

-- Only allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" ON public.blog_posts
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.blog_posts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON public.blog_posts
    FOR DELETE
    TO authenticated
    USING (true);
