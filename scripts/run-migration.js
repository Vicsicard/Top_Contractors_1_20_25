const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://bmiyyaexngxbrzkyqgzk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaXl5YWV4bmd4YnJ6a3lxZ3prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTI4ODM2OSwiZXhwIjoyMDUwODY0MzY5fQ.yCpovouVpF2ejTzvrTi6FNplKCeNU20Ghh445DgrKWQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const migrations = [
  '../src/database/create_exec_sql_function.sql',
  '../src/database/create_posts_table.sql',
  '../src/database/migrations/add_authors_tags_columns.sql',
  '../src/database/migrations/add_excerpt_column.sql',
  '../src/database/migrations/add_feature_image_column.sql',
  '../src/database/migrations/add_reading_time_column.sql',
  '../src/database/migrations/add_trade_category_column.sql'
];

async function runMigration() {
  try {
    console.log('Running migrations...');

    for (const migration of migrations) {
      console.log(`Running migration: ${migration}`);
      const migrationSql = fs.readFileSync(
        path.join(__dirname, migration),
        'utf8'
      );

      // For the first migration (create_exec_sql_function.sql), use raw SQL
      if (migration === '../src/database/create_exec_sql_function.sql') {
        const { error } = await supabase.rpc('postgres_fdw_get_connections', {
          sql_query: migrationSql
        });

        if (error) {
          console.error(`Migration error for ${migration}:`, error);
          process.exit(1);
        }
      } else {
        // For other migrations, use exec_sql
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: migrationSql
        });

        if (error) {
          console.error(`Migration error for ${migration}:`, error);
          process.exit(1);
        }
      }

      console.log(`Successfully ran migration: ${migration}`);
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

runMigration();
