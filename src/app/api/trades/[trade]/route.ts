import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { tradesData } from '@/lib/trades-data';
import type { TradeData } from '@/types/trade';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

function createTradeSlug(str: string): string {
  return decodeURIComponent(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findMatchingTrade(slug: string): string | null {
  const normalizedSlug = createTradeSlug(slug);
  
  // Check direct matches
  if (tradesData[normalizedSlug]) {
    return normalizedSlug;
  }

  // Check alternative slugs
  for (const [tradeKey, tradeInfo] of Object.entries(tradesData) as [string, TradeData][]) {
    if (tradeInfo.alternativeSlugs?.includes(normalizedSlug)) {
      return tradeKey;
    }
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: { trade: string } }
) {
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

    // Find matching trade slug
    const decodedTrade = decodeURIComponent(params.trade);
    const matchingTrade = findMatchingTrade(decodedTrade);

    if (!matchingTrade) {
      return NextResponse.json({ error: 'Trade category not found' }, { status: 404 });
    }

    // Get the trade category details
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', matchingTrade)
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
      .eq('trade', matchingTrade);

    if (contractorsError) {
      console.error('Error fetching contractors:', contractorsError);
      return NextResponse.json({ error: contractorsError.message }, { status: 500 });
    }

    return NextResponse.json({
      trade: categoryData,
      contractors: contractors || [],
    });

  } catch (error) {
    console.error('Error in trade route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
