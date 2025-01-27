import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { fetchAllPosts, setGhostConfig, GhostPost } from '../src/utils/ghost';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
console.log('Loading environment variables from:', envPath);
config({ path: envPath });

console.log('Environment variables loaded:');
console.log('NEXT_PUBLIC_GHOST_URL:', process.env.NEXT_PUBLIC_GHOST_URL);
console.log('NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY:', process.env.NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY);
console.log('NEXT_PUBLIC_OLD_GHOST_URL:', process.env.NEXT_PUBLIC_OLD_GHOST_URL);
console.log('NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY:', process.env.NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY);
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Validate environment variables
const requiredEnvVars = [
    'NEXT_PUBLIC_GHOST_URL',
    'NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY',
    'NEXT_PUBLIC_OLD_GHOST_URL',
    'NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

// Set Ghost configuration explicitly
setGhostConfig({
    newGhostUrl: process.env.NEXT_PUBLIC_GHOST_URL,
    newGhostKey: process.env.NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY,
    oldGhostUrl: process.env.NEXT_PUBLIC_OLD_GHOST_URL,
    oldGhostKey: process.env.NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateGhostToSupabase() {
    try {
        console.log('Starting Ghost to Supabase migration...');
        
        // Get all posts from both Ghost instances
        console.log('Fetching posts from Ghost...');
        console.log('Fetching from new Ghost instance...');
        const newPosts = await fetchAllPosts(process.env.NEXT_PUBLIC_GHOST_URL!, process.env.NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY!);
        console.log(`Found ${newPosts.length} posts in new Ghost instance`);
        
        console.log('Fetching from old Ghost instance...');
        const oldPosts = await fetchAllPosts(process.env.NEXT_PUBLIC_OLD_GHOST_URL!, process.env.NEXT_PUBLIC_OLD_GHOST_ORG_CONTENT_API_KEY!);
        console.log(`Found ${oldPosts.length} posts in old Ghost instance`);

        const allPosts = [...newPosts, ...oldPosts];
        console.log(`Total posts found: ${allPosts.length}`);

        // Transform posts for Supabase
        console.log('Transforming posts...');
        const transformedPosts = allPosts.map(post => ({
            id: uuidv4(),
            slug: post.slug,
            title: post.title,
            html: post.html,
            feature_image: post.feature_image || null,
            feature_image_alt: post.feature_image_alt || null,
            excerpt: post.excerpt || null,
            published_at: post.published_at,
            updated_at: post.updated_at || null,
            reading_time: post.reading_time || null,
            tags: post.tags ? JSON.stringify(post.tags) : null,
            authors: post.authors ? JSON.stringify(post.authors) : null,
            source: post.source || 'ghost',
            original_id: post.id
        }));

        // Insert posts into Supabase in batches
        console.log('Inserting posts into Supabase...');
        const batchSize = 50;
        for (let i = 0; i < transformedPosts.length; i += batchSize) {
            const batch = transformedPosts.slice(i, i + batchSize);
            console.log(`Inserting batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(transformedPosts.length/batchSize)}...`);
            
            const { error } = await supabase
                .from('posts')
                .upsert(batch, {
                    onConflict: 'original_id',
                    ignoreDuplicates: false
                });

            if (error) {
                throw error;
            }
        }

        console.log('Migration completed successfully!');
        console.log(`Migrated ${transformedPosts.length} posts to Supabase`);
        console.log('- New Ghost posts:', newPosts.length);
        console.log('- Old Ghost posts:', oldPosts.length);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run the migration
migrateGhostToSupabase();