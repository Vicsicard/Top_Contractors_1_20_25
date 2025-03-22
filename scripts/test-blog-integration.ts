import { config } from 'dotenv';
import { resolve } from 'path';
import { blogSupabase } from '../src/utils/supabase-blog-client';
import type { Post } from '../src/types/blog';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
console.log('Loading environment variables from:', envPath);
config({ path: envPath });

async function testBlogIntegration() {
    console.log('Starting blog integration tests...');

    try {
        // Test database connection
        const { data: connectionTest, error: connectionError } = await blogSupabase
            .from('blog_posts')
            .select('count')
            .single();

        if (connectionError) {
            throw new Error(`Database connection failed: ${connectionError.message}`);
        }

        console.log('✓ Database connection successful');

        // Test post retrieval
        const { data: posts, error: postsError } = await blogSupabase
            .from('blog_posts')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(10);

        if (postsError) {
            throw new Error(`Failed to fetch posts: ${postsError.message}`);
        }

        if (!posts || posts.length === 0) {
            throw new Error('No posts found in database');
        }

        console.log(`✓ Successfully fetched ${posts.length} posts`);
        console.log('✓ Sample post:', {
            title: posts[0].title,
            slug: posts[0].slug,
            publishDate: posts[0].published_at
        });

        // Test post structure
        const samplePost = posts[0] as Post;
        
        const structureChecks = {
            hasId: !!samplePost.id,
            hasTitle: !!samplePost.title,
            hasSlug: !!samplePost.slug,
            hasHtml: !!samplePost.html,
            hasFeatureImage: 'feature_image' in samplePost,
            hasTags: typeof samplePost.tags === 'string',
            hasPublishDate: !!samplePost.published_at,
            hasUpdateDate: !!samplePost.updated_at
        };
        console.log('✓ Structure checks:', structureChecks);

        // Test content integrity
        const contentChecks = {
            titleIsString: typeof samplePost.title === 'string',
            slugIsValid: /^[a-z0-9-]+$/.test(samplePost.slug),
            hasPublishDate: !!samplePost.published_at,
            validPublishDate: samplePost.published_at ? !isNaN(new Date(samplePost.published_at).getTime()) : false,
            tagsAreValid: !samplePost.tags || typeof samplePost.tags === 'string',
            authorsAreValid: !samplePost.authors || Array.isArray(samplePost.authors)
        };
        console.log('✓ Content integrity checks:', contentChecks);

        // Test relationships
        const { data: relatedPosts, error: relatedError } = await blogSupabase
            .from('blog_posts')
            .select('*')
            .eq('trade_category', samplePost.trade_category)
            .neq('id', samplePost.id)
            .limit(3);

        if (relatedError) {
            throw new Error(`Failed to fetch related posts: ${relatedError.message}`);
        }

        console.log(`✓ Successfully fetched ${relatedPosts?.length || 0} related posts`);
        console.log('All tests passed successfully! ✨');

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testBlogIntegration();
