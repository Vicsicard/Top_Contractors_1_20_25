import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables when running as a script
if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(__dirname, '../../.env.local') });
}

// Check for both naming conventions
const blogSupabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const blogSupabaseAnonKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a mock Supabase client for when environment variables are missing
const createMockBlogClient = () => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          execute: async () => ({ data: [], error: null })
        }),
        order: () => ({
          execute: async () => ({ data: [], error: null })
        }),
        execute: async () => ({ data: [], error: null })
      })
    })
  };
};

let blogSupabase;

if (!blogSupabaseUrl || !blogSupabaseAnonKey) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Missing Blog Supabase environment variables in production, using mock client');
    blogSupabase = createMockBlogClient();
  } else {
    throw new Error('Missing Blog Supabase credentials in environment variables');
  }
} else {
  blogSupabase = createClient(blogSupabaseUrl, blogSupabaseAnonKey);
}

export { blogSupabase };
