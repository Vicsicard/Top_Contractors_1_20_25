import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidCategory, getStandardCategory } from '@/utils/category-mapper';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const standardCategory = getStandardCategory(params.category);
    
    if (!standardCategory || !isValidCategory(standardCategory)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq('trade_category', standardCategory)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
