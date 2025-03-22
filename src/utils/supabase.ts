import { createClient } from '@supabase/supabase-js';

// Function to create a Supabase client with proper error handling
const createSupabaseClient = () => {
  const mainSupabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
  const mainSupabaseAnonKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY;

  if (!mainSupabaseUrl || !mainSupabaseAnonKey) {
    // In production, return a mock client that returns empty data instead of throwing
    if (process.env.NODE_ENV === 'production') {
      console.warn('Missing Supabase environment variables in production, using mock client');
      return {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: null, error: null }),
              limit: () => ({
                order: () => ({
                  range: async () => ({ data: [], error: null, count: 0 })
                })
              }),
              order: () => ({
                range: async () => ({ data: [], error: null, count: 0 })
              }),
              range: async () => ({ data: [], error: null, count: 0 }),
              execute: async () => ({ data: [], error: null, count: 0 })
            }),
            limit: () => ({
              execute: async () => ({ data: [], error: null, count: 0 })
            }),
            not: () => ({
              execute: async () => ({ data: [], error: null, count: 0 })
            }),
            execute: async () => ({ data: [], error: null, count: 0 })
          }),
          count: () => ({
            eq: async () => ({ data: 0, error: null })
          })
        }),
        storage: {
          from: () => ({
            getPublicUrl: () => ({ data: { publicUrl: '' } })
          })
        }
      } as any;
    }
    
    // In development, still use empty strings but log a warning
    console.warn('Missing Supabase environment variables');
  }

  return createClient(mainSupabaseUrl || '', mainSupabaseAnonKey || '');
};

// Create a single supabase client for interacting with your database
export const mainSupabase = createSupabaseClient();

// Export mainSupabase as supabase for backward compatibility
export const supabase = mainSupabase;

export async function getMainSupabase() {
  return mainSupabase;
}
