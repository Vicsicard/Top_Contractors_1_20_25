import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
console.log('Loading environment variables from:', envPath);
config({ path: envPath });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPostTags() {
    try {
        // Get a few posts directly from Supabase
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .limit(5);

        if (error) throw error;

        console.log('\nChecking post tags and authors...\n');
        posts.forEach((post, index) => {
            console.log(`Post ${index + 1}: ${post.title}`);
            console.log('Tags (raw):', post.tags);
            try {
                const parsedTags = post.tags ? JSON.parse(post.tags) : [];
                console.log('Tags (parsed):', parsedTags);
            } catch (e) {
                console.log('Error parsing tags:', e);
            }
            console.log('Authors (raw):', post.authors);
            try {
                const parsedAuthors = post.authors ? JSON.parse(post.authors) : [];
                console.log('Authors (parsed):', parsedAuthors);
            } catch (e) {
                console.log('Error parsing authors:', e);
            }
            console.log('\n');
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

checkPostTags();
