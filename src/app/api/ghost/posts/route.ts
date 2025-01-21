import { NextResponse } from 'next/server';
import { getPosts, getPostsByCategory } from '@/utils/ghost';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category');

        console.log(`[DEBUG API] Received request with params:`, {
            page,
            limit,
            category
        });

        let result;
        if (category) {
            console.log(`[DEBUG API] Fetching posts for category: ${category}`);
            result = await getPostsByCategory(category, page, limit);
            console.log(`[DEBUG API] Found ${result.posts.length} posts for category ${category}`);
        } else {
            console.log(`[DEBUG API] Fetching all posts`);
            result = await getPosts(page, limit);
            console.log(`[DEBUG API] Found ${result.posts.length} total posts`);
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('[DEBUG API] Error in /api/ghost/posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}
