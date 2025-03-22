import { createClient } from '@supabase/supabase-js';

// Main Supabase client for videos and categories
const mainSupabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL!;
const mainSupabaseAnonKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY!;

// Create a single supabase client for interacting with your database
export const mainSupabase = createClient(mainSupabaseUrl, mainSupabaseAnonKey);

export async function getMainSupabase() {
  return mainSupabase;
}
