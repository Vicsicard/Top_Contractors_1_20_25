import { getPosts } from '../src/utils/posts';
import { markdownToHtml } from '../src/utils/markdown';

async function fetchAndDisplayPosts() {
    try {
        // Fetch posts from Supabase
        const { posts, totalPosts } = await getPosts(1, 10);
        console.log(`Found ${totalPosts} total posts`);

        // Convert markdown to HTML for each post
        for (const post of posts) {
            if (post.content) {
                const html = await markdownToHtml(post.content);
                console.log('\n-------------------');
                console.log(`Title: ${post.title}`);
                console.log(`Slug: ${post.slug}`);
                console.log(`HTML Content: ${html.substring(0, 200)}...`);
                console.log('-------------------\n');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchAndDisplayPosts();
