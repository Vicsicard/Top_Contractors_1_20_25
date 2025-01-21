import { getAllPosts, extractPostCategory } from '../src/utils/ghost';

async function analyzeCategories() {
    console.log('Starting category analysis of all posts...');
    
    try {
        const posts = await getAllPosts();
        console.log(`Found ${posts.length} total posts`);
        
        // Track categorization stats
        const stats = {
            categorized: 0,
            uncategorized: 0,
            byCategory: {} as Record<string, number>
        };
        
        // Track problematic slugs
        const uncategorizedPosts: Array<{title: string, slug: string}> = [];
        
        posts.forEach(post => {
            const category = extractPostCategory(post);
            if (category) {
                stats.categorized++;
                stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
            } else {
                stats.uncategorized++;
                uncategorizedPosts.push({
                    title: post.title,
                    slug: post.slug
                });
            }
        });
        
        // Print results
        console.log('\n=== Categorization Results ===');
        console.log(`Total Posts: ${posts.length}`);
        console.log(`Categorized: ${stats.categorized}`);
        console.log(`Uncategorized: ${stats.uncategorized}`);
        
        console.log('\n=== Posts Per Category ===');
        Object.entries(stats.byCategory)
            .sort(([,a], [,b]) => b - a)
            .forEach(([category, count]) => {
                console.log(`${category}: ${count} posts`);
            });
            
        if (uncategorizedPosts.length > 0) {
            console.log('\n=== Uncategorized Posts ===');
            uncategorizedPosts.forEach(post => {
                console.log(`- "${post.title}" (slug: ${post.slug})`);
            });
        }
        
    } catch (error) {
        console.error('Error analyzing categories:', error);
    }
}

analyzeCategories();
