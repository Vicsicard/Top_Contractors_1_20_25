import { readFileSync } from 'fs';
import { resolve } from 'path';
import { scriptSupabase } from '../src/utils/script-supabase';
import { getStandardCategory } from '../src/utils/category-mapper';
import { getStandardTag, getStandardTags, ValidTag } from '../src/utils/tag-mapper';
import { v5 as uuidv5 } from 'uuid';

// Create a UUID namespace for Hashnode posts
const HASHNODE_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

interface HashnodePost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  brief?: string;
  coverImage?: string;
  dateAdded: string;
  dateUpdated?: string;
  tags?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
}

interface HashnodeExport {
  posts: HashnodePost[];
}

function extractTradeCategory(post: HashnodePost): string | null {
  console.log('\nProcessing post:', post.title);

  // First check tags for trade categories
  if (post.tags && post.tags.length > 0) {
    console.log('Checking tags:', post.tags.map(t => t.name).join(', '));
    for (const tag of post.tags) {
      const standardCategory = getStandardCategory(tag.name);
      if (standardCategory) {
        console.log(`Found trade category from tag: ${tag.name} -> ${standardCategory}`);
        return standardCategory;
      }
    }
  }

  // If no category found in tags, try to infer from title
  console.log('Checking title:', post.title);
  
  // First try the full title
  const standardCategory = getStandardCategory(post.title);
  if (standardCategory) {
    console.log(`Inferred trade category from full title: ${post.title} -> ${standardCategory}`);
    return standardCategory;
  }

  // Then try individual words and pairs of words from the title
  const words = post.title.toLowerCase().split(/\s+/);
  console.log('Checking title words:', words.join(', '));
  
  // Try pairs of words first (e.g., "bathroom remodeling")
  for (let i = 0; i < words.length - 1; i++) {
    const pair = words[i] + ' ' + words[i + 1];
    const pairCategory = getStandardCategory(pair);
    if (pairCategory) {
      console.log(`Found trade category from word pair: ${pair} -> ${pairCategory}`);
      return pairCategory;
    }
  }

  // Try individual words
  for (const word of words) {
    const wordCategory = getStandardCategory(word);
    if (wordCategory) {
      console.log(`Found trade category from word: ${word} -> ${wordCategory}`);
      return wordCategory;
    }
  }

  console.log(`No trade category found for post: ${post.title}`);
  return null;
}

function extractTags(post: HashnodePost): Array<{ id: string; name: ValidTag; slug: string; description: string | null }> {
  const tags = new Set<ValidTag>();

  // First, try to get tags from Hashnode tags
  if (post.tags) {
    for (const tag of post.tags) {
      const standardTag = getStandardTag(tag.name);
      if (standardTag) {
        tags.add(standardTag);
      }
    }
  }

  // Then, extract tags from title
  const titleTags = getStandardTags(post.title);
  titleTags.forEach(tag => tags.add(tag));

  // Convert tags to the format expected by our database
  return Array.from(tags).map(tag => ({
    id: `tag_${tag}`,
    name: tag,
    slug: tag,
    description: null
  }));
}

async function processHashnodeExport(filePath: string) {
  try {
    console.log('Reading Hashnode export file:', filePath);
    const fileContent = readFileSync(filePath, 'utf-8');
    const exportData: HashnodeExport = JSON.parse(fileContent);

    console.log(`Found ${exportData.posts.length} posts in export`);

    for (const post of exportData.posts) {
      // Generate deterministic UUID from slug
      const id = uuidv5(post.slug, HASHNODE_NAMESPACE);

      // Extract trade category
      const tradeCategory = extractTradeCategory(post);

      // Skip posts without a trade category
      if (!tradeCategory) {
        console.log(`Skipping post without trade category: ${post.title}`);
        continue;
      }

      // Extract and standardize tags
      const standardTags = extractTags(post);

      // Transform to match our Post schema
      const transformedPost = {
        id,
        title: post.title,
        slug: post.slug,
        html: post.content,
        excerpt: post.brief || post.content.substring(0, 150) + '...',
        feature_image: post.coverImage || null,
        feature_image_alt: null,
        published_at: new Date(post.dateAdded).toISOString(),
        updated_at: post.dateUpdated ? new Date(post.dateUpdated).toISOString() : null,
        trade_category: tradeCategory,
        reading_time: Math.ceil(post.content.length / 1500), // Rough estimate
        authors: [{
          id: 'default',
          name: 'Top Contractors Denver',
          slug: 'top-contractors-denver',
          profile_image: null,
          bio: null,
          url: null
        }],
        tags: standardTags
      };

      // Insert or update in Supabase
      try {
        const { error } = await scriptSupabase
          .from('posts')
          .upsert(transformedPost, {
            onConflict: 'id',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('Error upserting post:', error);
          console.error('Failed post data:', transformedPost);
          continue;
        }

        console.log('Successfully processed post:', transformedPost.title);
        console.log('Tags:', transformedPost.tags.map(t => t.name).join(', '));
      } catch (error) {
        console.error('Error upserting post:', error);
        console.error('Failed post data:', transformedPost);
      }
    }

    console.log('Finished processing Hashnode export');
  } catch (error) {
    console.error('Error processing Hashnode export:', error);
    throw error;
  }
}

// Execute the script
const exportPath = resolve(__dirname, '../hashnode-export-2-3-25.json.json');
processHashnodeExport(exportPath)
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
