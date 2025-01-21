import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    return Response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
