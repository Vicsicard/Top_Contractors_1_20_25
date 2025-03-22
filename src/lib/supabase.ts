import { createClient } from '@supabase/supabase-js';

// Function to create a Supabase client with proper error handling
const createSupabaseClient = () => {
  // Check for both naming conventions
  const supabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
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
                range: async () => ({ data: [], error: null, count: 0 }),
                execute: async () => ({ data: [], error: null, count: 0 })
              }),
              range: async () => ({ data: [], error: null, count: 0 }),
              execute: async () => ({ data: [], error: null, count: 0 })
            }),
            limit: () => ({
              order: () => ({
                execute: async () => ({ data: [], error: null, count: 0 })
              }),
              execute: async () => ({ data: [], error: null, count: 0 })
            }),
            not: () => ({
              execute: async () => ({ data: [], error: null, count: 0 })
            }),
            order: () => ({
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
    
    // In development, still throw an error
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
};

export const supabase = createSupabaseClient();
