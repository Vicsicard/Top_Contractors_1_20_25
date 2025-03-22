import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/client';

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
  try {
    const supabase = createSupabaseClient();

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

    // Get all locations for this trade
    const { data: locations, error: locationsError } = await supabase
      .from('subregions')
      .select('*')
      .order('subregion_name', { ascending: true });

    if (locationsError) {
      console.error('Error fetching locations:', locationsError);
      return NextResponse.json({ error: 'Error fetching locations' }, { status: 500 });
    }

    return NextResponse.json({
      trade: categoryData,
      locations: locations || []
    });
  } catch (error) {
    console.error('Unexpected error in locations API:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
