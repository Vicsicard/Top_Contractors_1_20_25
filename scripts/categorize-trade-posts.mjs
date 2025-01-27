import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Trade categories and their related keywords
const TRADE_CATEGORIES_INFO = {
    'plumber': ['plumb', 'plumbing', 'water', 'pipe', 'drain', 'leak'],
    'electrician': ['electric', 'wiring', 'circuit', 'power', 'lighting'],
    'hvac': ['hvac', 'heat', 'cooling', 'air condition', 'furnace', 'ac unit'],
    'roofer': ['roof', 'shingle', 'gutter'],
    'painter': ['paint', 'stain', 'finish', 'color', 'wall finish'],
    'landscaper': ['landscap', 'garden', 'yard', 'lawn', 'sprinkler', 'outdoor'],
    'home-remodeling': ['home remodel', 'house remodel', 'renovation', 'whole home', 'whole house'],
    'bathroom-remodeling': ['bathroom', 'bath', 'shower', 'tub', 'vanity'],
    'kitchen-remodeling': ['kitchen', 'cabinet', 'countertop', 'appliance'],
    'siding-gutters': ['siding', 'gutter', 'exterior', 'facade'],
    'masonry': ['mason', 'brick', 'stone', 'concrete', 'block'],
    'decks': ['deck', 'patio', 'porch', 'outdoor space'],
    'flooring': ['floor', 'tile', 'hardwood', 'carpet', 'epoxy'],
    'windows': ['window', 'glass', 'pane', 'skylight'],
    'fencing': ['fence', 'gate', 'barrier', 'privacy wall'],
    'epoxy-garage': ['epoxy', 'garage floor', 'concrete floor']
};

// Function to extract trade category from post content and title
function extractTradeCategory(html, title) {
    if (!html) return null;
    
    // First try to find an exact URL match
    for (const trade of Object.keys(TRADE_CATEGORIES_INFO)) {
        const pattern = new RegExp(`href="https://www\\.topcontractorsdenver\\.com/blog/trades/${trade}(?:\\?[^"]*?)?"`, 'i');
        if (pattern.test(html)) {
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

        analysis.total = posts.length;
        console.log(`Found ${posts.length} total posts`);

        // Initialize trade counters
        Object.keys(TRADE_CATEGORIES_INFO).forEach(trade => {
            analysis.byTrade[trade] = {
                count: 0,
                posts: []
            };
        });

        // Analyze each post
        for (const post of posts) {
            const tradeCategory = extractTradeCategory(post.html, post.title);
            
            if (tradeCategory) {
                analysis.categorized++;
                analysis.byTrade[tradeCategory].count++;
                analysis.byTrade[tradeCategory].posts.push({
                    id: post.id,
                    title: post.title,
                    slug: post.slug
                });
            } else {
                analysis.uncategorized++;
                analysis.uncategorizedPosts.push({
                    id: post.id,
                    title: post.title,
                    slug: post.slug
                });
            }
        }

        // Generate report
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: analysis.total,
                categorized: analysis.categorized,
                uncategorized: analysis.uncategorized,
                percentageCategorized: ((analysis.categorized / analysis.total) * 100).toFixed(2)
            },
            tradeBreakdown: Object.entries(analysis.byTrade)
                .map(([trade, data]) => ({
                    trade,
                    count: data.count,
                    percentage: ((data.count / analysis.total) * 100).toFixed(2)
                }))
                .sort((a, b) => b.count - a.count),
            uncategorizedPosts: analysis.uncategorizedPosts
        };

        // Save report to file
        const reportPath = path.join(process.cwd(), 'trade-categorization-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log('\nCategorization Summary:');
        console.log(`Total Posts: ${report.summary.total}`);
        console.log(`Categorized: ${report.summary.categorized} (${report.summary.percentageCategorized}%)`);
        console.log(`Uncategorized: ${report.summary.uncategorized}`);
        
        console.log('\nTrade Breakdown:');
        report.tradeBreakdown.forEach(({ trade, count, percentage }) => {
            console.log(`${trade}: ${count} posts (${percentage}%)`);
        });
        
        console.log(`\nFull report saved to: ${reportPath}`);

        // Update posts with trade categories in Supabase
        console.log('\nUpdating posts in Supabase...');
        
        // Update each trade category separately
        for (const trade of Object.keys(TRADE_CATEGORIES_INFO)) {
            const posts = analysis.byTrade[trade].posts;
            if (posts.length > 0) {
                const { error: updateError } = await supabase
                    .from('posts')
                    .update({ trade_category: trade })
                    .in('id', posts.map(p => p.id));
                
                if (updateError) {
                    console.error(`Error updating ${trade} posts:`, updateError);
                } else {
                    console.log(`Successfully updated ${posts.length} posts for ${trade}`);
                }
            }
        }

        // Show some examples of uncategorized posts
        console.log('\nExample uncategorized posts:');
        for (let i = 0; i < Math.min(5, analysis.uncategorizedPosts.length); i++) {
            const post = analysis.uncategorizedPosts[i];
            console.log(`\n${i + 1}. "${post.title}" (${post.slug})`);
            // Get the post content
            const { data } = await supabase
                .from('posts')
                .select('html')
                .eq('id', post.id)
                .single();
            if (data) {
                // Show a snippet of the HTML content
                console.log('Content snippet:', data.html.substring(0, 200) + '...');
            }
        }

    } catch (error) {
        console.error('Error during categorization:', error);
        process.exit(1);
    }
}

categorizePosts();
