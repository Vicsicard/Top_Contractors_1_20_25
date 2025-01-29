import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/types/supabase.js';
import { config } from 'dotenv';
import { resolve } from 'path';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

interface GhostTag {
  slug: string;
}

interface GhostPost {
  title: string;
  slug: string;
  html: string;
  feature_image: string | null;
  feature_image_alt: string | null;
  excerpt: string | null;
  meta_description: string | null;
  reading_time: number | null;
  published_at: string;
  tags: GhostTag[];
}

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const ghostUrl = process.env.GHOST_URL || 'https://top-contractors-denver-2.ghost.io';
const ghostKey = process.env.GHOST_ORG_CONTENT_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

if (!ghostKey) {
  console.error('Missing Ghost API key in .env.local (GHOST_ORG_CONTENT_API_KEY)');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Function to fetch posts from Ghost
async function fetchGhostPosts() {
  const url = `${ghostUrl}/ghost/api/v3/content/posts/?key=${ghostKey}`;
  console.log('Fetching from Ghost URL:', url);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from Ghost: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('Raw Ghost API response:', JSON.stringify(data, null, 2));
  
  if (!data.posts || !Array.isArray(data.posts)) {
    throw new Error('Invalid response format from Ghost API');
  }
  
  // Log the first post as a sample
  if (data.posts.length > 0) {
    console.log('Sample post data:', {
      title: data.posts[0].title,
      feature_image: data.posts[0].feature_image,
      feature_image_alt: data.posts[0].feature_image_alt
    });
  }
  
  return data.posts;
}

// Function to extract trade category from boilerplate text and URL
function extractTradeFromBoilerplate(html: string): string | null {
  try {
    const dom = new JSDOM(html);
    const { document } = dom.window;
    
    // First try to find trade from URL in boilerplate section
    const boilerplateLinks = Array.from(document.querySelectorAll('a')).filter(link => {
      const href = link.getAttribute('href');
      return href?.includes('topcontractorsdenver.com/trades/');
    });

    for (const link of boilerplateLinks) {
      const href = link.getAttribute('href');
      if (href) {
        const match = href.match(/\/trades\/([^?/]+)/);
        if (match) {
          const tradeCategory = match[1];
          console.log(`Found trade category from URL: ${tradeCategory}`);
          return tradeCategory;
        }
      }
    }

    // Fallback to looking for "Explore our X in Denver" pattern
    const links = document.querySelectorAll('a');
    for (const link of links) {
      const text = link.textContent?.trim();
      const match = text?.match(/Explore our (.*?) in Denver/i);
      
      if (match) {
        const tradeCategory = match[1].toLowerCase()
          .replace(/\s+remodeling/i, '-remodeling')  // Handle special case for remodeling
          .replace(/\s+/g, '-');  // Convert other spaces to hyphens
        
        console.log(`Found trade category from text pattern: ${tradeCategory}`);
        return tradeCategory;
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting trade from boilerplate:', error);
    return null;
  }
}

// Function to determine trade category from Ghost tags as fallback
function getTradeCategory(tags: any[] | undefined, html: string, title: string): string {
  // First try to extract from boilerplate
  const boilerplateCategory = extractTradeFromBoilerplate(html);
  if (boilerplateCategory) {
    return boilerplateCategory;
  }
  
  // Fallback to tag-based categorization
  if (!tags || !Array.isArray(tags)) return 'general';
  const tradeTags = tags.map(tag => tag.slug);
  const categories = [
    'bathroom-remodeling',
    'decks',
    'electrical',
    'fencing',
    'flooring',
    'hvac',
    'kitchen-remodeling',
    'landscaping',
    'painting',
    'plumbing',
    'home-remodeling',
    'roofing',
    'siding-gutters',
    'windows',
  ];
  
  const matchedTag = tradeTags.find(tag => categories.includes(tag));
  if (matchedTag) {
    console.log(`Found trade category from tags: ${matchedTag}`);
    return matchedTag;
  }
  
  // Try to find trade category from title
  const titleLower = title.toLowerCase();
  for (const category of categories) {
    if (titleLower.includes(category.replace('-', ' '))) {
      console.log(`Found trade category from title: ${category}`);
      return category;
    }
  }
  
  console.log('No trade category found, defaulting to general');
  return 'general';
}

async function populateBlogPosts() {
  try {
    console.log('Starting blog posts population...');

    // Fetch posts from Ghost
    console.log('Fetching posts from Ghost...');
    const ghostPosts = await fetchGhostPosts();
    
    // Transform Ghost posts to our format
    const blogPosts = ghostPosts.map((post: GhostPost) => {
      // Log any posts with missing images
      if (!post.feature_image) {
        console.warn(`Post "${post.title}" is missing a feature image`);
      }
      
      return {
        title: post.title,
        slug: post.slug,
        html: post.html || '', // Store the full HTML content
        feature_image: post.feature_image,
        feature_image_alt: post.feature_image_alt || post.title,
        excerpt: post.excerpt || post.meta_description,
        trade_category: getTradeCategory(post.tags, post.html, post.title),
        reading_time: post.reading_time || 5,
        published_at: post.published_at
      };
    });

    console.log(`Found ${blogPosts.length} posts to import`);

    // Insert blog posts into Supabase
    const { error: insertError } = await supabase
      .from('posts')
      .upsert(blogPosts, { onConflict: 'slug' });

    if (insertError) throw insertError;

    console.log('Blog posts population completed successfully!');

    // Verify the posts were added
    const { data: posts, error: verifyError } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (verifyError) throw verifyError;

    console.log(`Successfully imported ${posts.length} posts to Supabase`);
  } catch (error) {
    console.error('Error populating blog posts:', error);
    process.exit(1);
  }
}

populateBlogPosts();
