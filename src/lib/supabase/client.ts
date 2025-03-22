import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_MAIN_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_MAIN_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient();
