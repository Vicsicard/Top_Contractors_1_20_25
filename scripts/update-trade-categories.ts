import { scriptSupabase } from '../src/utils/script-supabase';

async function updateTradeCategories() {
  try {
    console.log('Starting trade category updates...');

    // Update posts table
    const updates = [
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
      'windows'
    ];

    const { data: invalidCategories, error: checkError } = await scriptSupabase
      .from('posts')
      .select('trade_category')
      .not('trade_category', 'in', `(${validCategories.map(c => `'${c}'`).join(',')})`)
      .limit(10);

    if (checkError) {
      console.error('Error checking categories:', checkError);
      throw checkError;
    }

    if (invalidCategories && invalidCategories.length > 0) {
      console.error('Found invalid categories:', invalidCategories.map(p => p.trade_category));
      throw new Error('Invalid categories found');
    }

    // Update posts_tags table
    const tagUpdates = [
      ["bathroom remodeling", ["bathroom-remodeling", "bathroom", "bathrooms"]],
      ["electrician", ["electrical", "electric"]],
      ["epoxy garage", ["epoxy-garage", "epoxy"]],
      ["home remodeling", ["home-remodeling", "remodeling"]],
      ["kitchen remodeling", ["kitchen-remodeling", "kitchen", "kitchens"]],
      ["landscaper", ["landscaping"]],
      ["roofer", ["roofing"]]
    ];

    for (const [newTag, oldTags] of tagUpdates) {
      console.log(`Updating tags ${oldTags.join(', ')} to ${newTag}...`);
      const { error } = await scriptSupabase.rpc('exec_sql', {
        sql_query: `
          UPDATE posts_tags 
          SET 
            name = $1,
            slug = $1
          WHERE name = ANY($2::text[])
        `,
        params: [newTag, oldTags]
      });

      if (error) {
        console.error(`Error updating tags to ${newTag}:`, error);
        throw error;
      }
    }

    console.log('Successfully updated all trade categories and tags!');
  } catch (error) {
    console.error('Error updating trade categories:', error);
    process.exit(1);
  }
}

updateTradeCategories();
