const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const blogSupabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY
);

async function fixSlugsInBlogPostsTable() {
  console.log('🔧 FIXING SLUGS IN BLOG_POSTS TABLE\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Get all posts with slugs starting with dash
  const { data: invalidPosts, error } = await blogSupabase
    .from('blog_posts')
    .select('id, title, slug')
    .like('slug', '-%');

  if (error) {
    console.error('❌ Error fetching posts:', error);
    return;
  }

  console.log(`Found ${invalidPosts.length} posts with invalid slugs\n`);

  let fixed = 0;
  let failed = 0;

  for (const post of invalidPosts) {
    const oldSlug = post.slug;
    const newSlug = oldSlug.replace(/^-+/, ''); // Remove leading dashes

    console.log(`Fixing: "${oldSlug}" → "${newSlug}"`);

    // Update the slug
    const { error: updateError } = await blogSupabase
      .from('blog_posts')
      .update({ slug: newSlug })
      .eq('id', post.id);

    if (updateError) {
      console.log(`  ❌ Failed: ${updateError.message}\n`);
      failed++;
    } else {
      console.log(`  ✅ Fixed\n`);
      fixed++;
    }
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n✅ Fixed: ${fixed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${invalidPosts.length}\n`);
}

fixSlugsInBlogPostsTable().catch(console.error);
