const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const mainSupabase = createClient(
  process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL,
  process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY
);

async function fixSlugsInMainProject() {
  console.log('🔧 FIXING SLUGS IN MAIN PROJECT (posts table)\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Get all posts with slugs starting with dash
  const { data: invalidPosts, error } = await mainSupabase
    .from('posts')
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
    const { error: updateError } = await mainSupabase
      .from('posts')
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

fixSlugsInMainProject().catch(console.error);
