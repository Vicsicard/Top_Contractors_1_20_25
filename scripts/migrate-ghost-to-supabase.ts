import { createClient } from '@supabase/supabase-js';
import GhostContentAPI from '@tryghost/content-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env' });

// Verify environment variables are loaded
if (!process.env.NEXT_PUBLIC_GHOST_URL || !process.env.NEXT_PUBLIC_OLD_GHOST_URL) {
  console.error('Required environment variables are missing. Please check your .env file.');
  process.exit(1);
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Ghost API clients for both instances
const ghostClient1 = new GhostContentAPI({
  url: process.env.NEXT_PUBLIC_OLD_GHOST_URL!,
  key: process.env.NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY!,
  version: 'v5.0'
});

const ghostClient2 = new GhostContentAPI({
  url: process.env.NEXT_PUBLIC_GHOST_URL!,
  key: process.env.NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY!,
  version: 'v5.0'
});

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Initialize log file
const logFile = path.join(logsDir, `ghost-migration-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  logStream.write(logMessage);
}

// Validate post data
function validatePost(post: any): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!post.title) issues.push('Missing title');
  if (!post.slug) issues.push('Missing slug');
  if (!post.html) issues.push('Missing content');
  if (!post.published_at) issues.push('Missing publication date');

  return {
    isValid: issues.length === 0,
    issues
  };
}

// Process images in HTML content
function processHtmlContent(html: string, ghostUrl: string): string {
  // Convert relative image URLs to absolute URLs
  return html.replace(
    /src="\/content\/images\//g,
    `src="${ghostUrl}/content/images/`
  );
}

// Transform Ghost post to our schema
function transformPost(post: any, source: string) {
  return {
    id: `ghost_${source}_${post.id}`,
    title: post.title,
    slug: post.slug,
    html: processHtmlContent(post.html, source === 'old' ? process.env.NEXT_PUBLIC_OLD_GHOST_URL! : process.env.NEXT_PUBLIC_GHOST_URL!),
    excerpt: post.excerpt || post.meta_description,
    feature_image: post.feature_image,
    feature_image_alt: post.feature_image_alt || post.title,
    published_at: post.published_at,
    updated_at: post.updated_at,
    reading_time: post.reading_time,
    trade_category: post.primary_tag?.name || 'General',
    authors: post.authors?.map((author: any) => ({
      id: author.id,
      name: author.name,
      slug: author.slug,
      profile_image: author.profile_image,
      bio: author.bio,
      url: author.url
    })) || [{
      id: 'default',
      name: 'Top Contractors Denver',
      slug: 'top-contractors-denver',
      profile_image: null,
      bio: null,
      url: null
    }],
    tags: post.tags?.map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug
    })) || []
  };
}

async function fetchAndMigratePosts(client: any, source: string) {
  try {
    log(`Starting migration from ${source} Ghost instance...`);
    
    // Fetch all posts with their relationships
    const posts = await client.posts.browse({
      limit: 'all',
      include: ['authors', 'tags']
    });

    log(`Found ${posts.length} posts in ${source} Ghost instance`);

    let successCount = 0;
    let failureCount = 0;
    const failures: any[] = [];

    for (const post of posts) {
      try {
        // Validate post
        const validation = validatePost(post);
        if (!validation.isValid) {
          log(`⚠️ Validation failed for post "${post.title}": ${validation.issues.join(', ')}`);
          failureCount++;
          failures.push({
            title: post.title,
            issues: validation.issues
          });
          continue;
        }

        // Transform post
        const transformedPost = transformPost(post, source);

        // Insert into Supabase
        const { error } = await supabase
          .from('posts')
          .upsert(transformedPost, {
            onConflict: 'id',
            ignoreDuplicates: false
          });

        if (error) {
          throw error;
        }

        log(`✅ Successfully migrated post: ${transformedPost.title}`);
        successCount++;
      } catch (error: any) {
        log(`❌ Error migrating post "${post.title}": ${error.message}`);
        failureCount++;
        failures.push({
          title: post.title,
          error: error.message
        });
      }
    }

    // Log summary
    log('\nMigration Summary:');
    log(`Total posts processed: ${posts.length}`);
    log(`Successfully migrated: ${successCount}`);
    log(`Failed migrations: ${failureCount}`);

    if (failures.length > 0) {
      log('\nFailed Posts:');
      failures.forEach(failure => {
        log(`- ${failure.title}: ${failure.issues ? failure.issues.join(', ') : failure.error}`);
      });
    }

  } catch (error: any) {
    log(`❌ Fatal error during ${source} Ghost migration: ${error.message}`);
    throw error;
  }
}

async function main() {
  try {
    log('Starting Ghost blog migration...');

    // Only migrate from new Ghost instance since old subscription is expired
    log('Skipping old Ghost instance due to expired subscription');
    await fetchAndMigratePosts(ghostClient2, 'new');

    log('Migration completed successfully!');
  } catch (error: any) {
    log(`Fatal error: ${error.message}`);
    process.exit(1);
  } finally {
    logStream.end();
  }
}

// Run migration
main();
