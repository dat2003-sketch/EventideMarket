import { supabase } from './supabase';

export const profilesService = {
  async getPublicProfile(id: string) {
    const [{ data: profile, error: pErr }, { count }] = await Promise.all([
      supabase.from('profiles').select('id, display_name, avatar_url').eq('id', id).single(),
      supabase.from('listings').select('id', { count: 'exact', head: true }).eq('user_id', id).eq('is_available', true),
    ]);
    if (pErr) throw pErr;
    return { ...profile, listing_count: count ?? 0 } as any;
  },
};
