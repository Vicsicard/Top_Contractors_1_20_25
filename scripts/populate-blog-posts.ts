import { createClient } from '@supabase/supabase-js';
import { Database } from '../src/types/supabase.js';
import { config } from 'dotenv';
import { resolve } from 'path';
import fetch from 'node-fetch';

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
    console.log('Sample post HTML:', data.posts[0].html);
  }
  
  return data.posts;
}

// Function to determine trade category from Ghost tags
function getTradeCategory(tags: any[] | undefined) {
  if (!tags || !Array.isArray(tags)) return 'general';
  const tradeTags = tags.map(tag => tag.slug);
  const categories = [
    'bathroom', 'decks', 'electrical', 'fencing',
    'flooring', 'hvac', 'kitchen', 'landscaping',
    'painting', 'plumbing', 'remodeling', 'roofing',
    'siding', 'windows'
  ];
  
  return tradeTags.find(tag => categories.includes(tag)) || 'general';
}

async function populateBlogPosts() {
  try {
    console.log('Starting blog posts population...');

    // Fetch posts from Ghost
    console.log('Fetching posts from Ghost...');
    const ghostPosts = await fetchGhostPosts();
    
    // Transform Ghost posts to our format
    const blogPosts = ghostPosts.map((post: GhostPost) => ({
      title: post.title,
      slug: post.slug,
      html: post.html || '', // Store the full HTML content
      feature_image: post.feature_image,
      feature_image_alt: post.feature_image_alt || post.title,
      excerpt: post.excerpt || post.meta_description,
      trade_category: getTradeCategory(post.tags),
      reading_time: post.reading_time || 5,
      published_at: post.published_at
    }));

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
