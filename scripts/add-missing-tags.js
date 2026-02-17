const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const blogSupabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY
);

// Contractor-related keywords to tag mapping
const TAG_KEYWORDS = {
  'kitchen remodeling': ['kitchen', 'cabinetry', 'countertop', 'appliance', 'cooking'],
  'bathroom remodeling': ['bathroom', 'shower', 'bathtub', 'vanity', 'toilet', 'spa'],
  'home remodeling': ['remodel', 'renovation', 'upgrade', 'transform', 'redesign'],
  'electrician': ['electric', 'wiring', 'lighting', 'fixture', 'outlet', 'circuit'],
  'plumbing': ['plumb', 'pipe', 'faucet', 'drain', 'water', 'leak'],
  'hvac': ['hvac', 'heating', 'cooling', 'air conditioning', 'furnace', 'thermostat'],
  'roofer': ['roof', 'shingle', 'gutter', 'attic', 'skylight'],
  'flooring': ['floor', 'hardwood', 'tile', 'carpet', 'laminate', 'vinyl'],
  'landscaper': ['landscape', 'garden', 'lawn', 'outdoor', 'yard', 'patio', 'deck'],
  'painter': ['paint', 'color', 'wall', 'interior', 'exterior'],
  'masonry': ['brick', 'stone', 'concrete', 'masonry', 'fireplace'],
  'siding gutters': ['siding', 'gutter', 'exterior'],
  'windows': ['window', 'glass', 'door'],
  'fencing': ['fence', 'gate', 'privacy']
};

function detectTags(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  const detectedTags = [];

  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        detectedTags.push(tag);
        break;
      }
    }
  }

  // Default to home remodeling if no specific tags found
  if (detectedTags.length === 0) {
    detectedTags.push('home remodeling');
  }

  return detectedTags.join(', ');
}

async function addMissingTags() {
  console.log('🏷️  ADDING TAGS TO UNTAGGED BLOG POSTS\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Get posts without tags
  const { data: untaggedPosts, error } = await blogSupabase
    .from('merge_blog_posts')
    .select('id, title, slug, content, tags')
    .or('tags.is.null,tags.eq.');

  if (error) {
    console.error('❌ Error fetching posts:', error);
    return;
  }

  console.log(`Found ${untaggedPosts.length} posts without tags\n`);

  let fixed = 0;
  let failed = 0;

  for (const post of untaggedPosts) {
    const suggestedTags = detectTags(post.title, post.content || '');
    
    console.log(`📝 ${post.title.substring(0, 60)}...`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   Suggested tags: ${suggestedTags}`);

    const { error: updateError } = await blogSupabase
      .from('merge_blog_posts')
      .update({ tags: suggestedTags })
      .eq('id', post.id);

    if (updateError) {
      console.log(`   ❌ Failed: ${updateError.message}\n`);
      failed++;
    } else {
      console.log(`   ✅ Tagged\n`);
      fixed++;
    }
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n✅ Tagged: ${fixed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${untaggedPosts.length}\n`);
}

addMissingTags().catch(console.error);
