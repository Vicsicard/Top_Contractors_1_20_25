// Script to check the blog post content
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

async function checkPost() {
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
    
    console.log('Post found:');
    console.log('Title:', post.title);
    console.log('Has content:', !!post.content);
    console.log('Content length:', post.content?.length || 0);
    
    // Check for image patterns in content
    const markdownImageRegex = /!\[(.*?)\]\((.*?)\)/;
    const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?>/i;
    
    const markdownMatch = post.content.match(markdownImageRegex);
    const htmlMatch = post.content.match(htmlImageRegex);
    
    console.log('Contains markdown image:', !!markdownMatch);
    if (markdownMatch) {
      console.log('Markdown image URL:', markdownMatch[2]);
      console.log('Markdown image alt:', markdownMatch[1]);
    }
    
    console.log('Contains HTML image:', !!htmlMatch);
    if (htmlMatch) {
      console.log('HTML image URL:', htmlMatch[1]);
    }
    
    // Print the first 200 characters of content for inspection
    console.log('\nContent preview:');
    console.log(post.content.substring(0, 200) + '...');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkPost();
