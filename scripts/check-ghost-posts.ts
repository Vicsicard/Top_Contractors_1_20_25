import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Initialize log file
const logFile = path.join(logsDir, `ghost-posts-check-${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  logStream.write(logMessage);
}

async function checkGhostPosts() {
  try {
    log('Checking for Ghost posts in Supabase...');

    // Query all posts and filter for Ghost posts
    const { data: allPosts, error } = await supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Filter Ghost posts (those from ghost.org)
    const ghostPosts = allPosts.filter(post => 
      post.feature_image?.includes('ghost.io') || 
      (post.html && post.html.includes('ghost.io'))
    );

    if (error) {
      throw error;
    }

    log(`Found ${ghostPosts.length} Ghost posts in Supabase`);

    if (ghostPosts.length > 0) {
      log('\nGhost Posts:');
      ghostPosts.forEach(post => {
        log(`- ${post.title} (ID: ${post.id})`);
        log(`  Published: ${post.published_at}`);
        log(`  Category: ${post.trade_category}`);
        log(`  Has feature image: ${post.feature_image ? 'Yes' : 'No'}`);
        log(`  Has HTML content: ${post.html ? 'Yes' : 'No'}`);
        log('---');
      });
    } else {
      log('No Ghost posts found in the database.');
    }


    log(`\nTotal posts in database: ${allPosts.length}`);
    log(`Ghost posts percentage: ${((ghostPosts.length / allPosts.length) * 100).toFixed(2)}%`);

  } catch (error: any) {
    log(`Error checking Ghost posts: ${error.message}`);
  } finally {
    logStream.end();
  }
}

// Run the check
checkGhostPosts();
