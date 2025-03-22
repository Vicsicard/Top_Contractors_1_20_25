import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET() {
    try {
        // Test basic connection
        const { data: connectionTest, error: connectionError } = await supabase
            .from('posts')
            .select('count')
            .limit(1);

        if (connectionError) {
            console.error('Connection test failed:', connectionError);
            return NextResponse.json({ error: connectionError.message }, { status: 500 });
        }

        // Get all unique trade categories
        const { data: categories, error: categoriesError } = await supabase
            .from('posts')
            .select('trade_category')
            .not('trade_category', 'is', null);

        if (categoriesError) {
            console.error('Categories query failed:', categoriesError);
            return NextResponse.json({ error: categoriesError.message }, { status: 500 });
        }

        // Count posts by category
        const uniqueCategories = [...new Set(categories?.map((p: { trade_category: string }) => p.trade_category))];
        const categoryCounts: Record<string, number | null> = {};
        
        for (const category of uniqueCategories) {
            const { count } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('trade_category', category as string);
            
            categoryCounts[category as string] = count;
        }

        // Test getting posts for home-remodeling category
        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select('id, title, slug, trade_category')
            .eq('trade_category', 'home-remodeling')
            .limit(5);

        if (postsError) {
            console.error('Posts query failed:', postsError);
            return NextResponse.json({ error: postsError.message }, { status: 500 });
        }

        // Count posts with null trade_category
        const { count: nullCategoryCount } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .is('trade_category', null);

        return NextResponse.json({
            success: true,
            connectionTest,
            uniqueCategories,
            categoryCounts,
            nullCategoryCount,
            homeRemodelingPosts: posts,
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
