const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const blogSupabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY
);

async function fixDuplicateTitles() {
  console.log('🔧 FIXING DUPLICATE BLOG POST TITLES\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Get all posts
  const { data: allPosts, error } = await blogSupabase
    .from('merge_blog_posts')
    .select('id, title, slug, tags');

  if (error) {
    console.error('❌ Error fetching posts:', error);
    return;
  }

  // Find duplicates
  const titleMap = {};
  allPosts.forEach(post => {
    const normalized = post.title.toLowerCase().trim();
    if (!titleMap[normalized]) {
      titleMap[normalized] = [];
    }
    titleMap[normalized].push(post);
  });

  const duplicates = Object.entries(titleMap).filter(([_, posts]) => posts.length > 1);
  
  console.log(`Found ${duplicates.length} duplicate title groups\n`);

  let fixed = 0;
  let skipped = 0;

  for (const [title, posts] of duplicates) {
    console.log(`\n📝 Duplicate: "${title.substring(0, 60)}..."`);
    console.log(`   ${posts.length} posts with this title\n`);

    // Keep the first one, modify the others
    for (let i = 1; i < posts.length; i++) {
      const post = posts[i];
      
      // Create unique title by adding location or category context
      let newTitle = post.title;
      
      // Strategy 1: Add location if it's a contractor post
      if (post.tags && (post.tags.includes('denver') || post.tags.includes('contractor'))) {
        newTitle = `${post.title} - Denver Area`;
      }
      // Strategy 2: Add category context
      else if (post.tags) {
        const tagList = post.tags.split(',').map(t => t.trim());
        if (tagList.length > 0) {
          const primaryTag = tagList[0];
          newTitle = `${post.title} - ${primaryTag.charAt(0).toUpperCase() + primaryTag.slice(1)}`;
        }
      }
      // Strategy 3: Add version number
      else {
        newTitle = `${post.title} (${i + 1})`;
      }

      console.log(`   ${i}. Updating: ${post.slug}`);
      console.log(`      Old: ${post.title}`);
      console.log(`      New: ${newTitle}`);

      const { error: updateError } = await blogSupabase
        .from('merge_blog_posts')
        .update({ title: newTitle })
        .eq('id', post.id);

      if (updateError) {
        console.log(`      ❌ Failed: ${updateError.message}`);
        skipped++;
      } else {
        console.log(`      ✅ Fixed`);
        fixed++;
      }
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`\n✅ Fixed: ${fixed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`📊 Total duplicate groups: ${duplicates.length}\n`);
}

fixDuplicateTitles().catch(console.error);
