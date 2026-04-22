import { createClient } from '@supabase/supabase-js';

/**
 * lib/supabase/client.ts
 * Browser-side Supabase client.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
