import { createClient } from '@/utils/supabase-server';
import { NextRequest } from 'next/server';

// Enable caching with revalidation every hour
export const revalidate = 3600;

export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .order('name');

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
