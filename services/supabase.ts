import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnon) {
  console.warn('Missing Supabase envs');
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    storage: AsyncStorage,          // 👈 QUAN TRỌNG: để Supabase lưu session trên mobile
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
