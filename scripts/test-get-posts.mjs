import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Get Supabase credentials from environment variables
const blogSupabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const blogSupabaseAnonKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;
const mainSupabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
const mainSupabaseAnonKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY;

// Create Supabase clients
const blogSupabase = createClient(blogSupabaseUrl, blogSupabaseAnonKey);
const mainSupabase = createClient(mainSupabaseUrl, mainSupabaseAnonKey);

// List of valid tags for this project
const VALID_PROJECT_TAGS = [
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

// Helper function to check if a post belongs to this project based on tags
function postBelongsToProject(tags) {
  if (!tags) return false;
  
  const tagList = Array.isArray(tags) 
    ? tags.map(tag => tag.toLowerCase())
    : tags.split(',').map(tag => tag.trim().toLowerCase());
    
  return tagList.some(tag => VALID_PROJECT_TAGS.includes(tag));
}

async function testGetPosts() {
  console.log('=== TESTING GET POSTS FUNCTION ===\n');

  // Fetch posts from primary Supabase instance
  console.log('--- PRIMARY BLOG SUPABASE PROJECT ---');
  const { data: primaryPosts, error: primaryError } = await blogSupabase
    .from('blog_posts')
    .select('*')
    // No posted_on_site filter
    .order('created_at', { ascending: false });

  if (primaryError) {
    console.error('Error fetching primary posts:', primaryError);
  } else {
    console.log(`Fetched ${primaryPosts?.length || 0} posts from primary Supabase project`);
    
    // Filter by tags
    const primaryProjectPosts = primaryPosts.filter(post => postBelongsToProject(post.tags));
    console.log(`After filtering: ${primaryProjectPosts.length} primary posts match project criteria`);
  }

  // Fetch posts from secondary Supabase instance
  console.log('\n--- SECONDARY (MAIN) SUPABASE PROJECT ---');
  const { data: secondaryPosts, error: secondaryError } = await mainSupabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (secondaryError) {
    console.error('Error fetching secondary posts:', secondaryError);
  } else {
    console.log(`Fetched ${secondaryPosts?.length || 0} posts from secondary Supabase project`);
  }

  // Combine posts from both sources
  const allPosts = [...(primaryPosts || []), ...(secondaryPosts || [])];
  
  if (!allPosts || allPosts.length === 0) {
    console.log('No posts found in either Supabase project');
    return;
  }

  console.log(`\nCombined total: ${allPosts.length} posts`);

  // For primary posts, filter by tags
  // For secondary posts, include all of them regardless of tags
  const projectPosts = [
    ...(primaryPosts || []).filter(post => postBelongsToProject(post.tags)),
    ...(secondaryPosts || [])
  ];
  
  console.log(`After filtering: ${projectPosts.length} posts match project criteria`);
  
  // Save the first 50 posts to a file for inspection
  fs.writeFileSync('combined-posts.json', JSON.stringify(projectPosts.slice(0, 50), null, 2));
  console.log('\nSaved first 50 posts to combined-posts.json for inspection');
  
  console.log('\n=== TEST COMPLETE ===');
}

testGetPosts().catch(console.error);
