// Test script to verify blog post fetching from primary Supabase source
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Log environment variables for debugging (without revealing sensitive values)
console.log('Blog Supabase URL defined:', !!process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL);
console.log('Blog Supabase Anon Key defined:', !!process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY);

// Initialize Supabase client
const blogSupabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY
);

// Valid project tags for filtering
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
  
  const tagList = typeof tags === 'string' 
    ? tags.split(',').map(tag => tag.trim().toLowerCase())
    : Array.isArray(tags) 
      ? tags.map(tag => tag.toLowerCase())
      : [];
  
  return tagList.some(tag => VALID_PROJECT_TAGS.includes(tag));
}

async function testPrimaryBlogFetching() {
  try {
    console.log('=== TESTING PRIMARY BLOG POST FETCHING ===');
    
    // Test 'blog_posts' table
    console.log('\n1. Testing blog_posts table');
    const { data: blogPostsData, error: blogPostsError } = await blogSupabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (blogPostsError) {
      console.error('Error fetching from blog_posts table:', blogPostsError);
    } else {
      console.log(`Successfully fetched ${blogPostsData.length} posts from blog_posts table`);
      
      // Check post structure
      if (blogPostsData.length > 0) {
        console.log('Sample post structure from blog_posts table:', {
          id: blogPostsData[0].id,
          title: blogPostsData[0].title,
          tags: blogPostsData[0].tags,
          created_at: blogPostsData[0].created_at
        });
      }
    }
    
    // Test 'posts' table
    console.log('\n2. Testing posts table');
    const { data: postsData, error: postsError } = await blogSupabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (postsError) {
      console.error('Error fetching from posts table:', postsError);
    } else {
      console.log(`Successfully fetched ${postsData.length} posts from posts table`);
      
      // Check post structure
      if (postsData.length > 0) {
        console.log('Sample post structure from posts table:', {
          id: postsData[0].id,
          title: postsData[0].title,
          tags: postsData[0].tags,
          created_at: postsData[0].created_at
        });
      }
    }
    
    // List all tables in the database
    console.log('\n3. Listing all tables in the database');
    const { data: tablesData, error: tablesError } = await blogSupabase
      .rpc('list_tables');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      console.log('Tables in the database:', tablesData);
    }
    
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

// Run the test
testPrimaryBlogFetching()
  .then(() => console.log('\nTest completed'))
  .catch(err => console.error('Test failed:', err))
  .finally(() => process.exit());
