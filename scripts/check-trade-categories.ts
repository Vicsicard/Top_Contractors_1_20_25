import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTradeCategories() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('trade_category')
      .not('trade_category', 'is', null);

    if (error) {
      console.error('Error fetching trade categories:', error);
      process.exit(1);
    }

    // Get unique categories and sort them
    const categories = [...new Set(data.map(post => post.trade_category))].sort();
    
    console.log('\nTrade categories found in posts table:');
    console.log('=====================================');
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });
    console.log('\nTotal categories:', categories.length);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTradeCategories();
