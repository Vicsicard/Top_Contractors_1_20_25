import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL || '',
  process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET() {
  try {
    // Test Supabase connection and fetch data
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      throw new Error(`Supabase error: ${categoriesError.message}`);
    }

    // Fetch contractors to verify database access
    const { data: contractors, error: contractorsError } = await supabase
      .from('contractors')
      .select('*')
      .limit(5);

    if (contractorsError) {
      throw new Error(`Supabase error: ${contractorsError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection working correctly',
      data: {
        categories,
        sampleContractors: contractors
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
