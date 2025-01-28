import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    console.log('Loading environment variables from:', envPath);
    dotenv.config({ path: envPath });
} else {
    console.error('.env.local file not found at:', envPath);
    process.exit(1);
}

// Verify environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Required environment variables are missing:');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Trade categories and their related keywords
const TRADE_CATEGORIES_INFO = {
    'plumbing': ['plumb', 'plumbing', 'water', 'pipe', 'drain', 'leak'],
    'electrical': ['electric', 'wiring', 'circuit', 'power', 'lighting'],
    'hvac': ['hvac', 'heat', 'cooling', 'air condition', 'furnace', 'ac unit'],
    'roofing': ['roof', 'shingle', 'gutter'],
    'painting': ['paint', 'stain', 'finish', 'color', 'wall finish'],
    'landscaping': ['landscap', 'garden', 'yard', 'lawn', 'sprinkler', 'outdoor'],
    'remodeling': ['home remodel', 'house remodel', 'renovation', 'whole home', 'whole house'],
    'bathroom': ['bathroom', 'bath', 'shower', 'tub', 'vanity'],
    'kitchen': ['kitchen', 'cabinet', 'countertop', 'appliance'],
    'siding': ['siding', 'gutter', 'exterior', 'facade'],
    'masonry': ['mason', 'brick', 'stone', 'concrete', 'block'],
    'decks': ['deck', 'patio', 'porch', 'outdoor space'],
    'flooring': ['floor', 'tile', 'hardwood', 'carpet', 'epoxy'],
    'windows': ['window', 'glass', 'pane', 'skylight'],
    'fencing': ['fence', 'gate', 'barrier', 'privacy wall'],
    'epoxy': ['epoxy', 'garage floor', 'concrete floor']
};

// Function to extract trade category from post content and title
function extractTradeCategory(html, title) {
    if (!html) return null;
    
    console.log(`\nAnalyzing post: "${title}"`);
    
    // First try to find an exact URL match
    for (const trade of Object.keys(TRADE_CATEGORIES_INFO)) {
        const pattern = new RegExp(`href="https://www\\.topcontractorsdenver\\.com/blog/trades/${trade}(?:\\?[^"]*?)?"`, 'i');
        if (pattern.test(html)) {
            console.log(`Found exact URL match for trade: ${trade}`);
            return trade;
        }
    }

    // If no URL match, look for keywords in title and content
    const combinedText = (title + ' ' + html).toLowerCase();
    
    // Score each trade category based on keyword matches
    const scores = {};
    for (const [trade, keywords] of Object.entries(TRADE_CATEGORIES_INFO)) {
        scores[trade] = 0;
        for (const keyword of keywords) {
            const regex = new RegExp(keyword.toLowerCase(), 'g');
            const matches = combinedText.match(regex);
            if (matches) {
                scores[trade] += matches.length;
                console.log(`Found ${matches.length} matches for "${keyword}" in trade "${trade}"`);
            }
        }
    }

    // Find the trade with the highest score
    let maxScore = 0;
    let bestTrade = null;
    for (const [trade, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            bestTrade = trade;
        }
    }

    console.log(`Best matching trade: ${bestTrade} (score: ${maxScore})`);
    
    // Only return a trade if we have a significant match
    return maxScore >= 2 ? bestTrade : null;
}

async function categorizePosts() {
    console.log('Starting blog post categorization...');
    
    // Analysis data structure
    const analysis = {
        total: 0,
        categorized: 0,
        uncategorized: 0,
        byTrade: {},
        uncategorizedPosts: []
    };

    try {
        // Get all posts from Supabase
        const { data: posts, error } = await supabase
            .from('posts')
            .select('*');

        if (error) throw error;

        console.log(`Found ${posts.length} total posts`);
        analysis.total = posts.length;

        // Process each post
        for (const post of posts) {
            const category = extractTradeCategory(post.html, post.title);
            
            if (category) {
                // Update the post with its category
                const { error: updateError } = await supabase
                    .from('posts')
                    .update({ trade_category: category })
                    .eq('id', post.id);
                
                if (updateError) {
                    console.error(`Error updating post ${post.id}:`, updateError);
                    continue;
                }

                analysis.categorized++;
                analysis.byTrade[category] = (analysis.byTrade[category] || 0) + 1;
                console.log(`Categorized "${post.title}" as ${category}`);
            } else {
                analysis.uncategorized++;
                analysis.uncategorizedPosts.push({
                    id: post.id,
                    title: post.title,
                    slug: post.slug
                });
                console.log(`Could not categorize: "${post.title}"`);
            }
        }

        // Print analysis
        console.log('\nCategorization complete!');
        console.log(`Total posts: ${analysis.total}`);
        console.log(`Categorized: ${analysis.categorized}`);
        console.log(`Uncategorized: ${analysis.uncategorized}`);
        console.log('\nPosts by trade:');
        for (const [trade, count] of Object.entries(analysis.byTrade)) {
            console.log(`${trade}: ${count} posts`);
        }

        if (analysis.uncategorizedPosts.length > 0) {
            console.log('\nUncategorized posts:');
            for (const post of analysis.uncategorizedPosts) {
                console.log(`- ${post.title} (${post.slug})`);
            }
        }

    } catch (error) {
        console.error('Error during categorization:', error);
    }
}

// Run the script
categorizePosts();
