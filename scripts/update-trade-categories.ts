import { scriptSupabase } from '../src/utils/script-supabase';

type CategoryUpdate = [string, string[]];

async function updateTradeCategories() {
  try {
    console.log('Starting trade category updates...');

    // Update posts table
    const updates: CategoryUpdate[] = [
      ["bathroom remodeling", ["bathroom-remodeling", "bathroom", "bathrooms", "bathroom remodel"]],
      ["electrician", ["electrical", "electric"]],
      ["epoxy garage", ["epoxy-garage", "epoxy", "garage flooring"]],
      ["home remodeling", ["home-remodeling", "remodeling", "renovation", "general"]],
      ["kitchen remodeling", ["kitchen-remodeling", "kitchen", "kitchens"]],
      ["landscaper", ["landscaping", "landscape"]],
      ["roofer", ["roofing", "roof"]]
    ];

    for (const [newCategory, oldCategories] of updates) {
      console.log(`Updating ${oldCategories.join(', ')} to ${newCategory}...`);
      const { error } = await scriptSupabase.rpc('exec_sql', {
        sql_query: `
          UPDATE posts 
          SET trade_category = $1 
          WHERE trade_category = ANY($2::text[])
        `,
        params: [newCategory, oldCategories]
      });

      if (error) {
        console.error(`Error updating to ${newCategory}:`, error);
        throw error;
      }
    }

    // Verify categories
    const validCategories = [
      'bathroom remodeling',
      'decks',
      'electrician',
      'epoxy garage',
      'fencing',
      'flooring',
      'home remodeling',
      'hvac',
      'kitchen remodeling',
      'landscaper',
      'masonry',
      'plumbing',
      'roofer',
      'siding gutters',
      'windows'
    ];

    // Check for any posts with invalid categories
    const { data: invalidPosts, error: verifyError } = await scriptSupabase.rpc('exec_sql', {
      sql_query: `
        SELECT id, title, trade_category
        FROM posts
        WHERE trade_category IS NOT NULL
        AND trade_category NOT IN (SELECT unnest($1::text[]))
      `,
      params: [validCategories]
    });

    if (verifyError) {
      console.error('Error verifying categories:', verifyError);
      throw verifyError;
    }

    if (invalidPosts && invalidPosts.length > 0) {
      console.warn('Found posts with invalid categories:', invalidPosts);
    } else {
      console.log('All posts have valid categories!');
    }

    console.log('Trade category updates completed successfully!');
  } catch (error) {
    console.error('Failed to update trade categories:', error);
    process.exit(1);
  }
}

updateTradeCategories();
