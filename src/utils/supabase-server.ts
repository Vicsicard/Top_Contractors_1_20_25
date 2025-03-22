import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient<Database> | null = null;

export const createClient = (): SupabaseClient<Database> | any => {
  if (client) return client;

  // Check for both naming conventions
  const supabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
            order: () => ({
              execute: async () => ({ data: [], error: null }),
              range: async () => ({ data: [], error: null, count: 0 })
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
      };
    }
    
    // In development, still throw an error to ensure proper setup
    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_MAIN_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is not defined');
    }

    if (!supabaseKey) {
      throw new Error('NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
    }
  }

  client = createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public'
    }
  });

  return client;
};
