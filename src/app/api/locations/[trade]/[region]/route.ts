import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/client';

function createSlug(str: string): string {
  return decodeURIComponent(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(
  request: Request,
  { params }: { params: { trade: string; region: string } }
) {
  try {
    const supabase = createSupabaseClient();

    // Decode URL parameters
    const decodedTrade = decodeURIComponent(params.trade);
    const decodedRegion = decodeURIComponent(params.region);

    // Create proper slugs
    const processedSlugs = {
      trade: createSlug(decodedTrade),
      region: createSlug(decodedRegion)
    };

    // Get the category details
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', processedSlugs.trade)
      .single();

    if (categoryError) {
      console.error('Error fetching category:', categoryError);
      return NextResponse.json({ error: categoryError.message }, { status: 500 });
    }

    // Get the region details
    const { data: region, error: regionError } = await supabase
      .from('regions')
      .select('*')
      .eq('slug', processedSlugs.region)
      .single();

    if (regionError) {
      console.error('Error fetching region:', regionError);
      return NextResponse.json({ error: regionError.message }, { status: 500 });
    }

    // Get all areas in this region that have contractors in this trade
    const { data: contractors, error: contractorsError } = await supabase
      .from('contractors')
      .select('area')
      .eq('trade', processedSlugs.trade)
      .eq('region', processedSlugs.region);

    if (contractorsError) {
      console.error('Error fetching contractors:', contractorsError);
      return NextResponse.json({ error: 'Error fetching contractors' }, { status: 500 });
    }

    // Get unique areas
    const areas = [...new Set(contractors?.map((c: any) => c.area) || [])];

    // Format the response
    const response = {
      trade_category: {
        name: category.name,
        slug: category.slug,
        description: category.description
      },
      region: {
        name: region.name,
        slug: region.slug,
        description: region.description
      },
      areas: areas
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
