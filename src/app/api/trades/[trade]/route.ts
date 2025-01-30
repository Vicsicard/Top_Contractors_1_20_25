import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

function createTradeSlug(str: string): string {
  return decodeURIComponent(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(
  request: Request,
  { params }: { params: { trade: string } }
) {
  const supabase = createSupabaseClient();

  try {
    // Decode URL parameter
    const decodedTrade = decodeURIComponent(params.trade);
    const processedSlug = createTradeSlug(decodedTrade);

    // Get the trade category details
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', processedSlug)
      .single();

    if (categoryError) {
      console.error('Error fetching category:', categoryError);
      return NextResponse.json({ error: 'Trade category not found' }, { status: 404 });
    }

    if (!categoryData) {
      return NextResponse.json({ error: 'Trade category not found' }, { status: 404 });
    }

    // Get all contractors in this trade
    const { data: contractors, error: contractorsError } = await supabase
      .from('contractors')
      .select('*')
      .eq('trade', processedSlug);

    if (contractorsError) {
      console.error('Error fetching contractors:', contractorsError);
      return NextResponse.json({ error: contractorsError.message }, { status: 500 });
    }

    // Format the response
    const response = {
      trade_category: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description
      },
      contractors: contractors || []
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
