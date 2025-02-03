-- Update RLS policies for posts table
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Enable insert/update for service role only" ON posts;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON posts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for service role" ON posts
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role' OR 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Enable update for service role" ON posts
    FOR UPDATE USING (
        auth.role() = 'service_role' OR 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Enable delete for service role" ON posts
    FOR DELETE USING (
        auth.role() = 'service_role' OR 
        auth.role() = 'authenticated'
    );

-- Grant necessary permissions
GRANT ALL ON posts TO service_role;
GRANT ALL ON posts TO authenticated;
GRANT SELECT ON posts TO anon;

COMMIT;

-- Instructions:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to SQL Editor
-- 4. Create a new query
-- 5. Paste this SQL
-- 6. Run the query
