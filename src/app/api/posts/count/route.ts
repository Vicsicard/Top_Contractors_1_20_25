import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get total posts and posts per category
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        trade_category
      `, { count: 'exact' });

    if (error) {
      throw error;
    }

    // Count posts per category
    const categoryCount = data.reduce((acc, post) => {
      if (post.trade_category) {
        acc[post.trade_category] = (acc[post.trade_category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      total_posts: data.length,
      posts_per_category: categoryCount
    });

  } catch (error) {
    console.error('Error getting post count:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
