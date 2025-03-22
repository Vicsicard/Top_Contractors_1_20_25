import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables when running as a script
if (process.env.NODE_ENV !== 'production') {
  config({ path: resolve(__dirname, '../../.env.local') });
}

const blogSupabaseUrl = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const blogSupabaseAnonKey = process.env.NEXT_PUBLIC_BLOG_SUPABASE_ANON_KEY;

if (!blogSupabaseUrl || !blogSupabaseAnonKey) {
  throw new Error('Missing Blog Supabase credentials in environment variables');
}

export const blogSupabase = createClient(blogSupabaseUrl, blogSupabaseAnonKey);
