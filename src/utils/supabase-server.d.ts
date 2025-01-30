declare module '@/utils/supabase-server' {
  import { SupabaseClient } from '@supabase/supabase-js';
  import { Database } from '@/types/supabase';

  export function createClient(): SupabaseClient<Database>;
}
