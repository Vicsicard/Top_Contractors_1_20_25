// Script to debug the blog post data
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const blogSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

async function debugPost() {
  const slug = 'roofing-in-historic-districts-what-denver-code-requires';
  
  try {
    const { data: post, error } = await blogSupabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching post:', error);
      return;
    }
    
    if (!post) {
      console.log('Post not found');
      return;
    }
    
    // Log all fields to see what's available
    console.log('Post data:');
    console.log(JSON.stringify(post, null, 2));
    
    // Specifically check image-related fields
    console.log('\nImage fields:');
    console.log('image:', post.image);
    console.log('image_alt:', post.image_alt);
    console.log('feature_image:', post.feature_image);
    
    // Check for image patterns in content
    const markdownImageRegex = /!\[(.*?)\]\((.*?)\)/;
    const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?>/i;
    
    const markdownMatch = post.content.match(markdownImageRegex);
    const htmlMatch = post.content.match(htmlImageRegex);
    
    console.log('\nContent image detection:');
    console.log('Contains markdown image:', !!markdownMatch);
    console.log('Contains HTML image:', !!htmlMatch);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

debugPost();
