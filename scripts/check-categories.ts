import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('title, trade_category, html')
      .order('published_at', { ascending: false })
      .limit(5);

    if (error) throw error;

    console.log('\nRecent posts and their categories:\n');
    posts.forEach(post => {
      console.log(`Title: ${post.title}`);
      console.log(`Category: ${post.trade_category}`);
      
      // Extract boilerplate link
      const match = post.html?.match(/href="[^"]*\/trades\/([^?"]*)/);
      if (match) {
        console.log(`Found trade link: ${match[1]}`);
      }
      console.log('---\n');
    });

  } catch (error) {
    console.error('Error checking categories:', error);
  }
}

checkCategories();
