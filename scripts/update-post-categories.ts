import { scriptSupabase } from '../src/utils/script-supabase';
import { getStandardCategory } from '../src/utils/category-mapper';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from project root
config({ path: resolve(__dirname, '../.env') });

async function updatePostCategories() {
  try {
    console.log('Fetching all posts...');
    const { data: posts, error } = await scriptSupabase
      .from('posts')
      .select('*');

    if (error) {
      throw error;
    }

    console.log(`Found ${posts.length} posts to process`);

    for (const post of posts) {
      let tradeCategory = post.trade_category;

      // If no trade category is set, try to extract from tags
      if (!tradeCategory && post.tags) {
        // First try direct tag matches
        for (const tag of post.tags) {
          const category = getStandardCategory(tag.name);
          if (category) {
            tradeCategory = category;
            break;
          }
        }

        // If no direct match, try words within tags
        if (!tradeCategory) {
          for (const tag of post.tags) {
            const words = tag.name.toLowerCase().split(/[-\s]+/);
            for (const word of words) {
              const category = getStandardCategory(word);
              if (category) {
                tradeCategory = category;
                break;
              }
            }
            if (tradeCategory) break;
          }
        }

        // If we found a trade category, update the post
        if (tradeCategory) {
          console.log(`Updating post "${post.title}" with trade category: ${tradeCategory}`);
          const { error: updateError } = await scriptSupabase
            .from('posts')
            .update({ trade_category: tradeCategory })
            .eq('id', post.id);

          if (updateError) {
            console.error(`Error updating post ${post.id}:`, updateError);
          }
        } else {
          console.log(`No trade category found for post: ${post.title}`);
        }
      }
    }

    console.log('Finished updating post categories');
  } catch (error) {
    console.error('Error updating post categories:', error);
    process.exit(1);
  }
}

updatePostCategories()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
