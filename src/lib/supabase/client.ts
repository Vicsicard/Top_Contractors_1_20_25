import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
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
    
    // In development, still throw an error to ensure proper setup
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient();
