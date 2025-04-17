import { createClient as createClientBase } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClientBase<Database>(supabaseUrl, supabaseKey);
}
