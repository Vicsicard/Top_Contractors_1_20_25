import { scriptSupabase } from '../src/utils/script-supabase';

async function updateSchema() {
  try {
    console.log('Updating posts table schema...');

    const { error } = await scriptSupabase.rpc('exec_sql', {
      sql_query: `
        -- Add authors and tags columns if they don't exist
        ALTER TABLE posts
        ADD COLUMN IF NOT EXISTS authors JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

        -- Add comments
        COMMENT ON COLUMN posts.authors IS 'Array of author objects in JSONB format';
        COMMENT ON COLUMN posts.tags IS 'Array of tag objects in JSONB format';
      `
    });

    if (error) {
      console.error('Error updating schema:', error);
      process.exit(1);
    }

    console.log('Schema updated successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateSchema();
