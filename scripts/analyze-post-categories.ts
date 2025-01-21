import { getAllPosts, extractPostCategory } from '../src/utils/ghost.js';

async function analyzeCategories() {
    console.log('Starting category analysis of all posts...');
    
    try {
        const posts = await getAllPosts();
        const categories = new Map<string, number>();
        
        for (const post of posts) {
            const category = extractPostCategory(post) || 'uncategorized';
            const count = categories.get(category) || 0;
            categories.set(category, count + 1);
        }
        
        console.log('\nCategory Distribution:');
        console.log('---------------------');
        for (const [category, count] of categories.entries()) {
            console.log(`${category}: ${count} posts`);
        }
        
    } catch (error) {
        console.error('Error analyzing categories:', error);
    }
}

analyzeCategories();
