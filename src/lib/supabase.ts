import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * `null` when the env vars aren't set, so the app runs on sample data
 * without a backend. See .env.example.
 *
 * No login yet, so sessions aren't persisted. When accounts are added, pass
 * AsyncStorage as `auth.storage` and turn `persistSession` on.
 */
export const supabase = url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : null;
