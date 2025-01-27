import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
console.log('Loading environment variables from:', envPath);
config({ path: envPath });

import { getPosts, getPostBySlug, getPostsByCategory } from '../src/utils/supabase-blog';

async function testBlogIntegration() {
    console.log('Starting blog integration tests...\n');

    try {
        // Test 1: Fetch first page of posts
        console.log('Test 1: Fetching first page of posts...');
        const page1 = await getPosts(1, 10);
        console.log(`✓ Successfully fetched ${page1.posts.length} posts`);
        console.log(`✓ Total pages: ${page1.totalPages}`);
        console.log(`✓ Has next page: ${page1.hasNextPage}`);
        console.log('✓ Sample post:', {
            title: page1.posts[0].title,
            slug: page1.posts[0].slug,
            hasHtml: !!page1.posts[0].html,
            hasExcerpt: !!page1.posts[0].excerpt,
            hasTags: Array.isArray(page1.posts[0].tags),
            hasAuthors: Array.isArray(page1.posts[0].authors)
        });
        console.log('\n');

        // Test 2: Fetch a specific post by slug
        console.log('Test 2: Fetching specific post by slug...');
        const sampleSlug = page1.posts[0].slug;
        const singlePost = await getPostBySlug(sampleSlug);
        console.log(`✓ Successfully fetched post with slug: ${sampleSlug}`);
        console.log(`✓ Post title matches: ${singlePost?.title === page1.posts[0].title}`);
        console.log('\n');

        // Test 3: Test pagination
        console.log('Test 3: Testing pagination...');
        const page2 = await getPosts(2, 10);
        console.log(`✓ Successfully fetched page 2 with ${page2.posts.length} posts`);
        console.log(`✓ Posts are different from page 1: ${page2.posts[0].id !== page1.posts[0].id}`);
        console.log('\n');

        // Test 4: Test category filtering
        console.log('Test 4: Testing category filtering...');
        if (page1.posts[0].tags && page1.posts[0].tags.length > 0) {
            const category = page1.posts[0].tags[0].slug;
            const categoryPosts = await getPostsByCategory(category, 1, 10);
            console.log(`✓ Successfully fetched posts for category: ${category}`);
            console.log(`✓ Found ${categoryPosts.posts.length} posts in category`);
        } else {
            console.log('⚠ Skipped category test - no tags found in sample post');
        }
        console.log('\n');

        // Test 5: Verify post content
        console.log('Test 5: Verifying post content integrity...');
        const samplePost = page1.posts[0];
        const contentChecks = {
            hasTitle: !!samplePost.title,
            hasSlug: !!samplePost.slug,
            hasHtml: !!samplePost.html,
            hasPublishDate: !!samplePost.published_at,
            validPublishDate: !isNaN(new Date(samplePost.published_at).getTime()),
            tagsAreValid: !samplePost.tags || samplePost.tags.every(tag => tag.id && tag.name && tag.slug),
            authorsAreValid: !samplePost.authors || samplePost.authors.every(author => author.id && author.name)
        };
        console.log('✓ Content integrity checks:', contentChecks);

        console.log('\nAll tests completed successfully! 🎉');

    } catch (error) {
        console.error('Error during testing:', error);
        process.exit(1);
    }
}

testBlogIntegration();
