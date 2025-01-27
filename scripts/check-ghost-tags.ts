import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
console.log('Loading environment variables from:', envPath);
config({ path: envPath });

async function checkGhostTags() {
    try {
        const ghostUrl = process.env.NEXT_PUBLIC_GHOST_URL!;
        const ghostKey = process.env.NEXT_PUBLIC_GHOST_ORG_CONTENT_API_KEY!;
        
        console.log('Fetching posts from Ghost API...');
        const apiUrl = `${ghostUrl}/ghost/api/v3/content/posts/?key=${ghostKey}&limit=5&include=authors,tags&formats=html`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Ghost API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('\nGhost API Response:');
        data.posts.forEach((post: any, index: number) => {
            console.log(`\nPost ${index + 1}: ${post.title}`);
            console.log('Tags:', post.tags);
            console.log('Authors:', post.authors);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

checkGhostTags();
