-- Query to inspect the blog_posts table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' 
    AND table_name = 'blog_posts'
ORDER BY 
    ordinal_position;

-- Query to check a sample of posts with their tags
SELECT 
    title,
    tags,
    created_at,
    posted_on_site
FROM 
    blog_posts
WHERE 
    tags IS NOT NULL
    AND tags != '{}'
ORDER BY 
    created_at DESC
LIMIT 5;
