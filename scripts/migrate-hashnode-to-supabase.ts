import { fetchAndSyncRSSFeed } from '../src/utils/rss-client';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from project root
config({ path: resolve(__dirname, '../.env.local') });

const HASHNODE_HOST = process.env.HASHNODE_HOST;

if (!HASHNODE_HOST) {
  throw new Error('Missing HASHNODE_HOST environment variable');
}

// Format Hashnode RSS feed URL
let username = HASHNODE_HOST;
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

console.log('Starting Hashnode to Supabase migration...');
console.log('Using RSS feed URL:', feedUrl);

fetchAndSyncRSSFeed(feedUrl)
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
