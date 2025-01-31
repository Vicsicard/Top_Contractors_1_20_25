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

// Category mapping for standardization based on trades-data.ts slugs
const categoryMapping: { [key: string]: string } = {
  // Bathroom variations
  'bathroom': 'bathroom-remodeling',
  'bathroom remodeling': 'bathroom-remodeling',
  'bathroom remodelingX': 'bathroom-remodeling',
  'bathroom-remodelingX': 'bathroom-remodeling',
  'bathroomX': 'bathroom-remodeling',
  
  // Kitchen variations
  'kitchen': 'kitchen-remodeling',
  'kitchen remodeling': 'kitchen-remodeling',
  'kitchen-remodeling': 'kitchen-remodeling',
  
  // Home remodeling variations
  'home remodeling': 'home-remodeling',
  'remodeling': 'home-remodeling',
  'general': 'home-remodeling',
  
  // Plumbing variations
  'plumbers': 'plumbing',
  
  // Roofing variations
  'roofers': 'roofing',
  
  // Siding variations
  'siding and gutters': 'siding-gutters',
  'siding': 'siding-gutters',
  
  // Ensure other categories match exactly
  'electrical': 'electrical',
  'hvac': 'hvac',
  'carpentry': 'carpentry',
  'painting': 'painting',
  'landscaping': 'landscaping',
  'masonry': 'masonry',
  'decks': 'decks',
  'flooring': 'flooring',
  'windows': 'windows',
  'fencing': 'fencing',
  'epoxy garage': 'epoxy-garage',
  'epoxy-garage': 'epoxy-garage'
};

async function fixTradeCategories() {
  try {
    console.log('Starting trade category fixes...');

    // Get all posts with categories that need to be fixed
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, trade_category')
      .not('trade_category', 'is', null);

    if (error) {
      throw error;
    }

    console.log(`Found ${posts.length} posts to check`);

    // Track updates
    let updatesNeeded = 0;
    let updatesCompleted = 0;

    // Process each post
    for (const post of posts) {
      const currentCategory = post.trade_category;
      const newCategory = categoryMapping[currentCategory];

      if (newCategory) {
        updatesNeeded++;
        console.log(`Updating category: ${currentCategory} -> ${newCategory}`);

        const { error: updateError } = await supabase
          .from('posts')
          .update({ trade_category: newCategory })
          .eq('id', post.id);

        if (updateError) {
          console.error(`Error updating post ${post.id}:`, updateError);
        } else {
          updatesCompleted++;
        }
      }
    }

    console.log('\nCategory update summary:');
    console.log('=======================');
    console.log(`Total posts checked: ${posts.length}`);
    console.log(`Updates needed: ${updatesNeeded}`);
    console.log(`Updates completed: ${updatesCompleted}`);

    // Show final categories
    const { data: finalCategories } = await supabase
      .from('posts')
      .select('trade_category')
      .not('trade_category', 'is', null);

    const uniqueCategories = [...new Set(finalCategories?.map(p => p.trade_category))].sort();

    console.log('\nFinal trade categories:');
    console.log('=====================');
    uniqueCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category}`);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixTradeCategories();
