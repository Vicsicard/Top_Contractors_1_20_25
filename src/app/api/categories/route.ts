import { createClient } from '@/utils/supabase-server';
import { NextResponse } from 'next/server';

// Enable caching with revalidation every hour
export const revalidate = 3600;

export async function GET() {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('category_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error in categories API:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
