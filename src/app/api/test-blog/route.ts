import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/utils/supabase-blog';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const category = searchParams.get('category');

        if (!slug) {
            return NextResponse.json({
                success: false,
                error: 'Slug parameter is required'
            }, { status: 400 });
        }

        console.log('DEBUG: Test API called with params:', {
            slug,
            category,
            timestamp: new Date().toISOString()
        });

        const post = await getPostBySlug(slug, category || undefined);

        return NextResponse.json({
            success: true,
            found: !!post,
            params: { slug, category },
            post: post ? {
                id: post.id,
                title: post.title,
                slug: post.slug,
                trade_category: post.trade_category,
                excerpt: post.excerpt,
                published_at: post.published_at
            } : null,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('DEBUG: Test API error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
