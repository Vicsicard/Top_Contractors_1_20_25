import fetch from 'node-fetch';
import { config } from 'dotenv';
import { resolve } from 'path';
import { parseString } from 'xml2js';
import { promisify } from 'util';

// Load environment variables from project root
config({ path: resolve(__dirname, '../.env') });

const parseXml = promisify(parseString);

interface RSSFeed {
  rss: {
    channel: Array<{
      item: Array<{
        title: string[];
        'content:encoded': string[];
        description: string[];
        link: string[];
        pubDate: string[];
        guid: string[];
        creator: string[];
        category: string[];
      }>;
    }>;
  };
}

async function checkRssFeed() {
  const HASHNODE_BLOG_URL = process.env.HASHNODE_BLOG_URL;
  if (!HASHNODE_BLOG_URL) {
    throw new Error('Missing HASHNODE_BLOG_URL environment variable');
  }

  // Format username from host
  let username = HASHNODE_BLOG_URL;
  if (username.includes('hashnode.com/@')) {
    username = username.split('@').pop() || '';
  } else {
    username = username.replace(/^https?:\/\//, '')
                      .replace(/\.hashnode\.dev\/?$/, '');
  }
  username = username.replace(/\/$/, '');

  // Use the Hashnode user feed format
  const feedUrl = `https://hashnode.com/@${username}/rss.xml`;
  console.log('Fetching RSS feed from:', feedUrl);

  try {
    const response = await fetch(feedUrl);
    const text = await response.text();
    
    // Parse XML to JS object
    const result = await parseXml(text) as RSSFeed;
    
    console.log('\nRSS Feed structure:', JSON.stringify({
      hasRss: !!result.rss,
      hasChannel: result.rss?.channel?.length,
      hasItems: result.rss?.channel?.[0]?.item?.length
    }, null, 2));

    if (!result.rss?.channel?.[0]?.item?.length) {
      throw new Error('No items found in RSS feed');
    }

    const firstPost = result.rss.channel[0].item[0];
    
    console.log('\nFirst post details:');
    console.log('Title:', firstPost.title?.[0] || 'No title');
    console.log('\nContent preview (first 500 chars):');
    if (firstPost['content:encoded']?.[0]) {
      console.log(firstPost['content:encoded'][0].substring(0, 500));
    } else {
      console.log('No content:encoded field found');
      console.log('Available fields:', Object.keys(firstPost));
      console.log('Raw post data:', JSON.stringify(firstPost, null, 2));
    }
    
    // Write full response to file for inspection
    const fs = require('fs');
    fs.writeFileSync('rss-feed-sample.json', JSON.stringify(result, null, 2));
    console.log('\nFull RSS feed data written to rss-feed-sample.json');
    
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
  }
}

checkRssFeed().catch(console.error);
