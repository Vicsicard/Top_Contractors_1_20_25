import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create a function to get the Supabase client with proper error handling
const getSupabaseClient = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
    const supabaseKey = process.env.MAIN_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // In production, return a mock client that returns empty data
      if (process.env.NODE_ENV === 'production') {
        console.warn('Missing Supabase environment variables in production, using mock client for populate route');
        return {
          from: () => ({
            select: () => ({
              limit: () => ({
                execute: async () => ({ data: [], error: null, count: null, status: 200, statusText: 'OK' })
              }),
              execute: async () => ({ data: [], error: null, count: null, status: 200, statusText: 'OK' })
            })
          })
        } as any;
      }
      
      // In development, throw an error
      throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
};

export async function GET() {
  try {
    const supabase = getSupabaseClient();

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
