import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables when running as a script
if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(__dirname, '../../.env.local') });
}

// Log environment variables for debugging (without revealing sensitive values)
if (process.env.NODE_ENV !== 'production') {
  console.log('[DEBUG] Blog Supabase URL defined:', !!process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL);
  console.log('[DEBUG] Blog Supabase Anon Key defined:', !!process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY);
  console.log('[DEBUG] Main Supabase URL defined:', !!process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL);
  console.log('[DEBUG] Main Supabase Anon Key defined:', !!process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY);
}

// Get the blog Supabase credentials
const blogSupabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const blogSupabaseAnonKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

// Get the main Supabase credentials for the secondary blog source
const mainSupabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
const mainSupabaseAnonKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY;

// Create a mock Supabase client for when environment variables are missing
const createMockBlogClient = (): SupabaseClient => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            range: () => Promise.resolve({ data: [], error: null, count: 0 }),
          }),
          limit: () => Promise.resolve({ data: [], error: null, count: 0 }),
        }),
        order: () => ({
          range: () => Promise.resolve({ data: [], error: null, count: 0 }),
        }),
      }),
    }),
  } as unknown as SupabaseClient;
};

let blogSupabase: SupabaseClient;
let secondaryBlogSupabase: SupabaseClient | null = null;

// Initialize primary blog Supabase client
if (!blogSupabaseUrl || !blogSupabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('[WARN] Missing Blog Supabase environment variables in production, using mock client');
  } else {
    console.log('[DEBUG] Using mock client for Blog Supabase in development');
  }
  blogSupabase = createMockBlogClient();
} else {
  blogSupabase = createClient(blogSupabaseUrl, blogSupabaseAnonKey);
  console.log('[INFO] Primary blog Supabase client initialized');
}

// Initialize secondary blog Supabase client using Main Supabase credentials
if (mainSupabaseUrl && mainSupabaseAnonKey) {
  secondaryBlogSupabase = createClient(mainSupabaseUrl, mainSupabaseAnonKey);
  console.log('[INFO] Secondary blog Supabase client initialized using Main Supabase project');
} else {
  console.log('[WARN] Secondary blog Supabase client not initialized due to missing credentials');
}

export { blogSupabase, secondaryBlogSupabase };
