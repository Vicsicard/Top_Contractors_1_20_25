import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/lib/supabase/client';

// Enable caching with revalidation every 15 minutes
export const revalidate = 900;

function createSlug(str: string): string {
  return decodeURIComponent(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(
  request: Request,
  { params }: { params: { trade: string; region: string; area: string } }
) {
  const supabase = createSupabaseClient();

  try {
    // Decode URL parameters
    const decodedTrade = decodeURIComponent(params.trade);
    const decodedRegion = decodeURIComponent(params.region);
    const decodedArea = decodeURIComponent(params.area);

    // Create proper slugs
    const processedSlugs = {
      trade: createSlug(decodedTrade),
      region: createSlug(decodedRegion),
      area: createSlug(decodedArea)
    };

    // Get all contractors in this area for the specified trade
    const { data: contractors, error } = await supabase
      .from('contractors')
      .select('*')
      .eq('trade', processedSlugs.trade)
      .eq('region', processedSlugs.region)
      .eq('area', processedSlugs.area);

    if (error) {
      console.error('Error fetching contractors:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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

    // Format the response
    const response = {
      trade_category: {
        name: category.name,
        slug: category.slug,
        description: category.description
      },
      region: processedSlugs.region,
      area: processedSlugs.area,
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
