import { fetchAndSyncRSSFeed, validateRSSFeed } from '../src/utils/rss-client';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from project root
config({ path: resolve(__dirname, '../.env') });

const HASHNODE_BLOG_URL = process.env.HASHNODE_BLOG_URL;
const SYNC_INTERVAL = process.env.RSS_SYNC_INTERVAL ? 
  parseInt(process.env.RSS_SYNC_INTERVAL) : 30 * 60 * 1000; // Default: 30 minutes

async function syncPosts() {
  try {
    if (!HASHNODE_BLOG_URL) {
      throw new Error('HASHNODE_BLOG_URL environment variable is not set');
    }

    // Format Hashnode RSS feed URL
    // Extract username from either @username or subdomain format
    let username = HASHNODE_BLOG_URL;
    if (username.includes('hashnode.com/@')) {
      // Extract from @username format
      username = username.split('@').pop() || '';
    } else {
      // Extract from subdomain format
      username = username.replace(/^https?:\/\//, '')
                        .replace(/\.hashnode\.dev\/?$/, '');
    }
    // Remove any trailing slashes
    username = username.replace(/\/$/, '');
    
    // Use the Hashnode user feed format
    const feedUrl = `https://hashnode.com/@${username}/rss.xml`;
    console.log('Attempting to fetch RSS feed from:', feedUrl);
    
    // Validate feed before attempting sync
    const isValid = await validateRSSFeed(feedUrl);
    if (!isValid) {
      throw new Error('RSS feed validation failed');
    }

    // Perform the sync
    await fetchAndSyncRSSFeed(feedUrl);
    console.log('RSS feed sync completed successfully');
  } catch (error) {
    console.error('RSS sync failed:', error);
    process.exit(1);
  }
}

// Check if --watch flag is provided
const watchMode = process.argv.includes('--watch');

if (watchMode) {
  console.log(`Starting RSS sync in watch mode (every ${SYNC_INTERVAL/1000} seconds)`);
  // Initial sync
  syncPosts();
  // Set up interval for subsequent syncs
  setInterval(syncPosts, SYNC_INTERVAL);
} else {
  // Single sync
  syncPosts()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
