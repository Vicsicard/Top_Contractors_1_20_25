-- Create stored procedure for upserting posts
CREATE OR REPLACE FUNCTION upsert_post(post_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO posts (
        id,
        title,
        slug,
        html,
        excerpt,
        feature_image,
        feature_image_alt,
        published_at,
        updated_at,
        reading_time,
        trade_category,
        authors,
        tags
    )
    VALUES (
        (post_data->>'id')::text,
        (post_data->>'title')::text,
        (post_data->>'slug')::text,
        (post_data->>'html')::text,
        (post_data->>'excerpt')::text,
        (post_data->>'feature_image')::text,
        (post_data->>'feature_image_alt')::text,
        (post_data->>'published_at')::timestamptz,
        (post_data->>'updated_at')::timestamptz,
        (post_data->>'reading_time')::integer,
        (post_data->>'trade_category')::text,
        (post_data->'authors')::jsonb[],
        (post_data->'tags')::jsonb[]
    )
    ON CONFLICT (slug)
    DO UPDATE SET
        id = EXCLUDED.id,
        title = EXCLUDED.title,
        html = EXCLUDED.html,
        excerpt = EXCLUDED.excerpt,
        feature_image = EXCLUDED.feature_image,
        feature_image_alt = EXCLUDED.feature_image_alt,
        published_at = EXCLUDED.published_at,
        updated_at = EXCLUDED.updated_at,
        reading_time = EXCLUDED.reading_time,
        trade_category = EXCLUDED.trade_category,
        authors = EXCLUDED.authors,
        tags = EXCLUDED.tags;
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION upsert_post(jsonb) TO service_role;

-- Instructions:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Create a new query
-- 5. Paste this SQL
-- 6. Run the query
