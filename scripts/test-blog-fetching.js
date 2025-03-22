// Test script to verify blog post fetching from both Supabase sources
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Log environment variables for debugging (without revealing sensitive values)
console.log('Blog Supabase URL defined:', !!process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL);
console.log('Blog Supabase Anon Key defined:', !!process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY);
console.log('Main Supabase URL defined:', !!process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL);
console.log('Main Supabase Anon Key defined:', !!process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY);

// Initialize Supabase clients
const blogSupabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY
);

const mainSupabase = createClient(
  process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL,
  process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY
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

async function testBlogFetching() {
  try {
    console.log('=== TESTING BLOG POST FETCHING ===');
    
    // Test primary Supabase (blog project)
    console.log('\n1. Testing primary Supabase (blog project)');
    const { data: primaryPosts, error: primaryError } = await blogSupabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (primaryError) {
      console.error('Error fetching from primary Supabase:', primaryError);
    } else {
      console.log(`Successfully fetched ${primaryPosts.length} posts from primary Supabase`);
      
      // Check post structure
      if (primaryPosts.length > 0) {
        console.log('Sample primary post structure:', {
          id: primaryPosts[0].id,
          title: primaryPosts[0].title,
          tags: primaryPosts[0].tags,
          created_at: primaryPosts[0].created_at
        });
        
        // Check how many posts have valid project tags
        const validTagPosts = primaryPosts.filter(post => postBelongsToProject(post.tags));
        console.log(`Posts with valid project tags: ${validTagPosts.length} out of ${primaryPosts.length}`);
      }
    }
    
    // Test secondary Supabase (main project)
    console.log('\n2. Testing secondary Supabase (main project)');
    const { data: secondaryPosts, error: secondaryError } = await mainSupabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    if (secondaryError) {
      console.error('Error fetching from secondary Supabase:', secondaryError);
    } else {
      console.log(`Successfully fetched ${secondaryPosts.length} posts from secondary Supabase`);
      
      // Check post structure
      if (secondaryPosts.length > 0) {
        console.log('Sample secondary post structure:', {
          id: secondaryPosts[0].id,
          title: secondaryPosts[0].title,
          tags: secondaryPosts[0].tags,
          created_at: secondaryPosts[0].created_at
        });
      }
    }
    
    // Test combined posts
    if (primaryPosts && secondaryPosts) {
      console.log('\n3. Testing combined posts');
      
      // Filter primary posts by project tags
      const filteredPrimaryPosts = primaryPosts.filter(post => postBelongsToProject(post.tags));
      console.log(`Filtered primary posts: ${filteredPrimaryPosts.length}`);
      
      // Combine posts
      const allPosts = [...filteredPrimaryPosts, ...secondaryPosts];
      console.log(`Total combined posts: ${allPosts.length}`);
      
      // Sort by date
      allPosts.sort((a, b) => {
        const dateA = new Date(b.created_at || b.published_at || b.date || 0).getTime();
        const dateB = new Date(a.created_at || a.published_at || a.date || 0).getTime();
        return dateA - dateB;
      });
      
      // Show first 5 posts after sorting
      console.log('First 5 posts after combining and sorting:');
      allPosts.slice(0, 5).forEach((post, index) => {
        console.log(`${index + 1}. ${post.title} (${new Date(post.created_at || post.published_at || post.date).toISOString().split('T')[0]})`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

// Run the test
testBlogFetching()
  .then(() => console.log('\nTest completed'))
  .catch(err => console.error('Test failed:', err))
  .finally(() => process.exit());
