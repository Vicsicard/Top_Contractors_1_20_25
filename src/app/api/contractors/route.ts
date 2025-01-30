import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category_slug = searchParams.get('category')
    const neighborhood_slug = searchParams.get('neighborhood')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const offset = (page - 1) * limit
    
    const supabase = await createClient()
    
    let query = supabase
      .from('contractors')
      .select(`
        *,
        categories!inner(*),
        neighborhoods!inner(
          *,
          subregions!inner(
            *,
            regions!inner(*)
          )
        )
      `)
      
    if (category_slug) {
      query = query.eq('categories.slug', category_slug)
    }
    
    if (neighborhood_slug) {
      query = query.eq('neighborhoods.slug', neighborhood_slug)
    }
    
    const { data: contractors, error: dbError, count } = await query
      .order('contractor_name', { ascending: true })
      .range(offset, offset + limit - 1)
      
    if (dbError) {
      return Response.json({ error: dbError.message }, { status: 500 })
    }
    
    return Response.json({
      contractors,
      page,
      limit,
      total: count || 0,
      hasMore: (count || 0) > offset + limit
    })
    
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in contractors API:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
