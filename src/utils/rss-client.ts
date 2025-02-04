import Parser from 'rss-parser';
import fetch from 'node-fetch';
import { scriptSupabase } from './script-supabase';
import { getStandardCategory } from './category-mapper';
import { Post } from '@/types/blog';

// Extend the Parser.Item type to include Hashnode-specific fields
interface HashnodeRSSItem extends Parser.Item {
  'content:encoded'?: string;
  'content:encodedSnippet'?: string;
  categories?: string[];
  coverImage?: string;
  brief?: string;
  content?: string;
  description?: string[];
}

// Create a custom parser with the fields we need
const parser = new Parser<{item: HashnodeRSSItem}>({
  customFields: {
    item: [
      'content:encoded',
      'content:encodedSnippet',
      'coverImage'
    ]
  }
});

/**
 * Extract trade category from post tags/categories
 */
function extractTradeCategory(categories?: string[]): string | null {
  if (!categories || categories.length === 0) return null;
  
  // Look for categories that start with "trade-"
  const tradeCategory = categories.find(cat => 
    cat.toLowerCase().startsWith('trade-')
  );

  if (tradeCategory) {
    // Remove "trade-" prefix and normalize
    const category = tradeCategory.toLowerCase().replace(/^trade-/, '');
    console.log('Found trade category:', category);
    return getStandardCategory(category);
  }

  // If no trade category found, try to infer from title or content
  for (const category of categories) {
    const standardCategory = getStandardCategory(category);
    if (standardCategory) {
      console.log('Inferred category from tag:', category, '→', standardCategory);
      return standardCategory;
    }
  }

  console.log('No trade category found in categories:', categories);
  return null;
}

/**
 * Transform RSS item to match our Post interface
 */
import { v5 as uuidv5 } from 'uuid';

// Create a UUID namespace for our Hashnode posts
const HASHNODE_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

function transformRSSItem(item: HashnodeRSSItem): Partial<Post> {
  const slug = item.guid?.split('/').pop() || '';
  // Generate a deterministic UUID based on the slug
  const id = uuidv5(slug, HASHNODE_NAMESPACE);
  
  // Use content:encoded for full HTML content, fallback to description
  const html = item['content:encoded'] || item.description?.[0] || '';
  
  return {
    id,
    title: item.title || '',
    slug: slug,
    html,
    excerpt: item.brief || item['content:encodedSnippet'] || null,
    feature_image: item.coverImage || null,
    feature_image_alt: null, // Hashnode RSS doesn't provide alt text
    published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    updated_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
    trade_category: extractTradeCategory(item.categories),
    reading_time: Math.ceil((html.length || 0) / 1500), // Rough estimate: 1500 chars ≈ 1 minute
    authors: item.creator ? [{
      id: `hashnode_author_${item.creator}`,
      name: item.creator,
      slug: item.creator.toLowerCase().replace(/\s+/g, '-'),
      profile_image: null,
      bio: null,
      url: null
    }] : undefined,
    tags: item.categories ? item.categories.map(cat => ({
      id: `hashnode_tag_${cat.toLowerCase().replace(/\s+/g, '_')}`,
      name: cat,
      slug: cat.toLowerCase().replace(/\s+/g, '-'),
      description: null
    })) : undefined
  };
}

/**
 * Fetch and sync RSS feed with Supabase
 */
export async function fetchAndSyncRSSFeed(feedUrl: string) {
  try {
    console.log('Starting RSS feed sync from:', feedUrl);
    
    // Fetch the RSS feed
    const feed = await parser.parseURL(feedUrl);
    console.log(`Fetched ${feed.items.length} items from RSS feed`);

    // Process each item
    for (const item of feed.items) {
      const postData = transformRSSItem(item);
      
      if (!postData.slug) {
        console.warn('Skipping item with no slug:', item.title);
        continue;
      }

      // Insert or update using Supabase stored procedure
      try {
        const { error } = await scriptSupabase
          .from('posts')
          .upsert({
            ...postData,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'slug',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('Error upserting post:', error);
          console.error('Failed post data:', postData);
          throw error;
        }

        console.log('Successfully synced post:', postData.title);
      } catch (error) {
        console.error('Error upserting post:', error);
        console.error('Failed post data:', postData);
        throw error; // Re-throw to be caught by outer try-catch
      }
    }

    console.log('RSS feed sync completed successfully');
    return true;
  } catch (error) {
    console.error('RSS feed sync failed:', error);
    throw error;
  }
}

/**
 * Validate RSS feed URL and test connection
 */
export async function validateRSSFeed(feedUrl: string): Promise<boolean> {
  try {
    console.log('Validating RSS feed URL:', feedUrl);

    // First try to fetch the URL directly to check status and content type
    const response = await fetch(feedUrl);
    console.log('Feed response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type')
    });

    if (!response.ok) {
      console.error('Feed URL returned error status:', response.status);
      return false;
    }

    // Get the response text for debugging
    const text = await response.text();
    console.log('Feed content preview:', text.substring(0, 200));

    // Try parsing as RSS
    const feed = await parser.parseString(text);
    
    if (!feed) {
      console.error('RSS feed parsing returned null or undefined');
      return false;
    }
    
    if (!feed.items || feed.items.length === 0) {
      console.error('RSS feed contains no items');
      return false;
    }
    
    console.log('RSS feed validation successful:', {
      title: feed.title,
      itemCount: feed.items.length,
      feedUrl: feed.feedUrl,
      link: feed.link
    });
    
    return true;
  } catch (error) {
    console.error('RSS feed validation failed:', {
      url: feedUrl,
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error
    });
    return false;
  }
}
