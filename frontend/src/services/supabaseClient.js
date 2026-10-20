import { createClient } from '@supabase/supabase-js';

// Supabase Project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jvnkvrecneirfcjhthgz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Client is instantiated if anon key is provided
export const supabase = supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = Boolean(supabaseAnonKey);
