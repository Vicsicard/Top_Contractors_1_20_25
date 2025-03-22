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
  
  const tagList = tags.split(',').map(tag => tag.trim().toLowerCase());
  return tagList.some(tag => VALID_PROJECT_TAGS.includes(tag));
}

async function debugBlogPosts() {
  console.log('=== DEBUGGING BLOG POSTS ===\n');

  // Check Blog Supabase project
  console.log('--- PRIMARY BLOG SUPABASE PROJECT ---');
  console.log(`URL: ${blogSupabaseUrl}`);
  
  try {
    // Get all posts from blog_posts table
    const { data: blogPosts, error: blogError, count: blogCount } = await blogSupabase
      .from('blog_posts')
      .select('*', { count: 'exact' });
    
    if (blogError) {
      console.error('Error fetching blog posts:', blogError);
    } else {
      console.log(`Total posts in blog_posts table: ${blogPosts.length}`);
      console.log(`Posts with posted_on_site=true: ${blogPosts.filter(p => p.posted_on_site === true).length}`);
      
      // Check how many posts have valid project tags
      const postsWithValidTags = blogPosts.filter(post => postBelongsToProject(post.tags));
      console.log(`Posts with valid project tags: ${postsWithValidTags.length}`);
      
      // Log the first 5 posts with valid tags
      console.log('\nSample posts with valid tags:');
      postsWithValidTags.slice(0, 5).forEach((post, i) => {
        console.log(`${i+1}. ${post.title} (Tags: ${post.tags})`);
      });
      
      // Save all posts with valid tags to a file for inspection
      fs.writeFileSync('valid-blog-posts.json', JSON.stringify(postsWithValidTags, null, 2));
    }
  } catch (error) {
    console.error('Exception when fetching from blog Supabase:', error);
  }
  
  console.log('\n--- SECONDARY (MAIN) SUPABASE PROJECT ---');
  console.log(`URL: ${mainSupabaseUrl}`);
  
  try {
    // Check what tables exist in the main Supabase project
    console.log('\nChecking available tables:');
    
    // Try to get posts from blog_posts table
    const { data: mainPosts, error: mainError } = await mainSupabase
      .from('blog_posts')
      .select('*');
    
    if (mainError) {
      console.error('Error fetching from blog_posts table:', mainError.message);
      
      // If blog_posts doesn't exist, try other potential table names
      const tablesToTry = ['posts', 'articles', 'content', 'blogs'];
      
      for (const tableName of tablesToTry) {
        console.log(`\nTrying table: ${tableName}`);
        try {
          const { data: posts, error } = await mainSupabase
            .from(tableName)
            .select('*')
            .limit(5);
          
          if (!error && posts && posts.length > 0) {
            console.log(`Found ${posts.length} items in ${tableName} table`);
            console.log('Sample item:', posts[0]);
            
            // Try to get all posts from this table
            const { data: allPosts, error: allError } = await mainSupabase
              .from(tableName)
              .select('*');
            
            if (!allError && allPosts) {
              console.log(`Total items in ${tableName} table: ${allPosts.length}`);
              
              // Save these posts to a file for inspection
              fs.writeFileSync(`${tableName}-from-main.json`, JSON.stringify(allPosts, null, 2));
            }
          } else if (error) {
            console.log(`Error with ${tableName} table:`, error.message);
          } else {
            console.log(`No items found in ${tableName} table`);
          }
        } catch (e) {
          console.log(`Exception trying to access ${tableName} table:`, e.message);
        }
      }
    } else {
      console.log(`Total posts in blog_posts table: ${mainPosts.length}`);
      
      // Check how many posts have valid project tags
      const postsWithValidTags = mainPosts.filter(post => postBelongsToProject(post.tags));
      console.log(`Posts with valid project tags: ${postsWithValidTags.length}`);
      
      // Log the first 5 posts with valid tags
      console.log('\nSample posts with valid tags:');
      postsWithValidTags.slice(0, 5).forEach((post, i) => {
        console.log(`${i+1}. ${post.title || 'No title'} (Tags: ${post.tags || 'No tags'})`);
      });
      
      // Save all posts with valid tags to a file for inspection
      fs.writeFileSync('valid-main-posts.json', JSON.stringify(postsWithValidTags, null, 2));
    }
  } catch (error) {
    console.error('Exception when fetching from main Supabase:', error);
  }
  
  console.log('\n=== DEBUG COMPLETE ===');
}

debugBlogPosts().catch(console.error);
