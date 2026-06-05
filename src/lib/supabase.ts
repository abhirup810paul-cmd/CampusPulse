import { createClient } from '@supabase/supabase-js';

// Take only the first whitespace-delimited token to guard against the case where
// multiple env vars were accidentally concatenated into a single value.
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = rawUrl.split(/\s+/)[0] || '';
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').split(/\s+/)[0] || '';

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const url = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(url, key);
