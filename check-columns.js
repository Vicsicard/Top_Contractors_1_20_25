// Simple script to check column names in the blog_posts table
const { createClient } = require('@supabase/supabase-js');

// Use the same environment variables as in the app
const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('No data found in the blog_posts table');
      return;
    }

    console.log('Column names in blog_posts table:');
    const columnNames = Object.keys(data[0]);
    columnNames.forEach(column => {
      console.log(`- ${column}: ${typeof data[0][column]}`);
    });

    console.log('\nSample data:');
    console.log(JSON.stringify(data[0], null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkColumns();
