import { scriptSupabase } from '../src/utils/script-supabase';

const CATEGORY_MAPPINGS = {
  'bathroom remodeling': 'bathroom-remodeling',
  'bathroomremodeling': 'bathroom-remodeling',
  'home remodeling': 'home-remodeling',
  'homeremodeling': 'home-remodeling',
  'kitchen remodeling': 'kitchen-remodeling',
  'kitchenremodeling': 'kitchen-remodeling',
  'epoxy garage': 'epoxy-garage',
  'siding gutters': 'siding-gutters',
  'sidinggutters': 'siding-gutters',
  // Single word categories stay the same
  'decks': 'decks',
  'electrician': 'electrician',
  'fencing': 'fencing',
  'flooring': 'flooring',
  'hvac': 'hvac',
  'landscaper': 'landscaper',
  'masonry': 'masonry',
  'plumbing': 'plumbing',
  'roofer': 'roofer',
  'windows': 'windows'
};

async function fixTradeCategories() {
  try {
    console.log('Starting trade category fix...');

    // Get all posts
    const { data: posts, error: fetchError } = await scriptSupabase
      .from('posts')
      .select('id, title, trade_category');

    if (fetchError) {
      throw new Error(`Failed to fetch posts: ${fetchError.message}`);
    }

    console.log(`Found ${posts?.length || 0} posts to check`);

    // Track statistics
    const stats = {
      total: posts?.length || 0,
      updated: 0,
      skipped: 0,
      categories: new Set<string>()
    };

    // Process each post
    for (const post of posts || []) {
      if (!post.trade_category) {
        console.log(`Skipping post "${post.title}" - No category`);
        stats.skipped++;
        continue;
      }

      const currentCategory = post.trade_category.toLowerCase();
      const mappedCategory = CATEGORY_MAPPINGS[currentCategory as keyof typeof CATEGORY_MAPPINGS];

      if (mappedCategory && mappedCategory !== currentCategory) {
        console.log(`Updating post "${post.title}": ${currentCategory} → ${mappedCategory}`);
        
        const { error: updateError } = await scriptSupabase
          .from('posts')
          .update({ trade_category: mappedCategory })
          .eq('id', post.id);

        if (updateError) {
          console.error(`Error updating post ${post.title}:`, updateError);
        } else {
          stats.updated++;
          stats.categories.add(mappedCategory);
        }
      } else {
        console.log(`Skipping post "${post.title}" - Category already correct: ${currentCategory}`);
        stats.skipped++;
        stats.categories.add(currentCategory);
      }
    }

    // Log final statistics
    console.log('\nFinal Statistics:');
    console.log('----------------');
    console.log(`Total Posts: ${stats.total}`);
    console.log(`Updated: ${stats.updated}`);
    console.log(`Skipped: ${stats.skipped}`);
    console.log('Categories Found:', Array.from(stats.categories));
    console.log('\nCategory fix completed successfully! ✅');

  } catch (error) {
    console.error('\n❌ Category fix failed:', error);
    process.exit(1);
  }
}

fixTradeCategories();
