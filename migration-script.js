// migration-script.js
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase clients
const blogSupabase = createClient(
  process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY
);

const mainSupabase = createClient(
  process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL,
  process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY
);

// Batch size for inserts
const BATCH_SIZE = 50;

// Main migration function
async function migrateAllPosts() {
  console.log('Starting migration process...');
  
  // Step 1: Migrate posts from blog_posts table
  await migrateBlogPosts();
  
  // Step 2: Migrate posts from main posts table
  await migrateMainPosts();
  
  console.log('Migration complete!');
}

// Function to migrate posts from blog_posts table
async function migrateBlogPosts() {
  console.log('Migrating posts from blog_posts table...');
  
  // Get all posts from blog_posts
  const { data: blogPosts, error } = await blogSupabase
    .from('blog_posts')
    .select('id, title, slug, content, created_at, tags, posted_on_site, images');
    
  if (error) {
    console.error('Error fetching blog posts:', error);
    return;
  }
  
  console.log(`Found ${blogPosts.length} posts in blog_posts table`);
  
  // Process in batches
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < blogPosts.length; i += BATCH_SIZE) {
    const batch = blogPosts.slice(i, i + BATCH_SIZE);
    
    // Transform posts for the merged table
    const transformedBatch = batch.map(post => {
      // Create a clean object with only the fields we need
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        created_at: post.created_at,
        tags: post.tags,
        posted_on_site: post.posted_on_site,
        images: post.images,
        source_table: 'blog_posts',
        original_id: post.id
      };
    });
    
    // Insert into merge_blog_posts
    const { data, error: insertError } = await blogSupabase
      .from('merge_blog_posts')
      .insert(transformedBatch);
      
    if (insertError) {
      console.error(`Error inserting batch ${i/BATCH_SIZE + 1}:`, insertError);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      console.log(`Successfully migrated batch ${i/BATCH_SIZE + 1} (${successCount} posts total)`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`Blog posts migration complete: ${successCount} migrated, ${errorCount} errors`);
}

// Function to migrate posts from main posts table
async function migrateMainPosts() {
  console.log('Migrating posts from main posts table...');
  
  // Get all posts from main posts table
  const { data: mainPosts, error } = await mainSupabase
    .from('posts')
    .select('id, title, slug, html, excerpt, feature_image, feature_image_alt, authors, tags, reading_time, trade_category, created_at, published_at, updated_at');
    
  if (error) {
    console.error('Error fetching main posts:', error);
    return;
  }
  
  console.log(`Found ${mainPosts.length} posts in main posts table`);
  
  // Get existing slugs from merge_blog_posts to avoid duplicates
  const { data: existingSlugs } = await blogSupabase
    .from('merge_blog_posts')
    .select('slug');
    
  const slugSet = new Set(existingSlugs.map(p => p.slug));
  
  // Process in batches
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < mainPosts.length; i += BATCH_SIZE) {
    const batch = mainPosts.slice(i, i + BATCH_SIZE);
    const transformedBatch = [];
    
    for (const post of batch) {
      // Skip if slug already exists
      if (slugSet.has(post.slug)) {
        skippedCount++;
        continue;
      }
      
      // Transform post to match blog_posts structure
      const transformedPost = {
        id: uuidv4(), // Generate new UUID
        title: post.title || 'Untitled Post',
        slug: post.slug,
        content: post.html || '', // Use html as content since main posts use html
        created_at: post.created_at || new Date().toISOString(),
        tags: Array.isArray(post.tags) ? post.tags.join(',') : (post.tags || ''),
        posted_on_site: true, // Set to true for all imported posts
        images: null, // Default to null as main posts might not have images
        source_table: 'posts',
        original_id: post.id
      };
      
      transformedBatch.push(transformedPost);
      slugSet.add(post.slug); // Add to set to avoid duplicates in future batches
    }
    
    // Skip if batch is empty (all posts were duplicates)
    if (transformedBatch.length === 0) {
      console.log(`Batch ${i/BATCH_SIZE + 1} skipped - all posts were duplicates`);
      continue;
    }
    
    // Insert into merge_blog_posts
    const { data, error: insertError } = await blogSupabase
      .from('merge_blog_posts')
      .insert(transformedBatch);
      
    if (insertError) {
      console.error(`Error inserting batch ${i/BATCH_SIZE + 1}:`, insertError);
      errorCount += transformedBatch.length;
    } else {
      successCount += transformedBatch.length;
      console.log(`Successfully migrated batch ${i/BATCH_SIZE + 1} (${successCount} posts total)`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`Main posts migration complete: ${successCount} migrated, ${skippedCount} skipped (duplicates), ${errorCount} errors`);
}

// Run the migration
migrateAllPosts().catch(error => {
  console.error('Migration failed:', error);
});
