import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    slug: string;
  };
};

export async function GET(
  request: NextRequest,
  context: Props
) {
  try {
  const { slug } = context.params;
    const supabase = await createClient()
    
    const { data: contractor, error: dbError } = await supabase
      .from('contractors')
      .select(`
        *,
        categories(*),
        neighborhoods(
          *,
          subregions(
            *,
            regions(*)
          )
        )
      `)
      .eq('slug', slug)
      .single()
      
    if (dbError) {
      return Response.json({ error: dbError.message }, { status: 500 })
    }
    
    if (!contractor) {
      return Response.json(
        { error: 'Contractor not found' },
        { status: 404 }
      )
    }
    
    return Response.json(contractor)
    
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in contractor details API:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
