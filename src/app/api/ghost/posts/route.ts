import { NextResponse } from 'next/server';
import { getPosts, getPostsByCategory } from '@/utils/supabase-blog';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');

    try {
        const data = category
            ? await getPostsByCategory(category, page, limit)
            : await getPosts(page, limit);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}
