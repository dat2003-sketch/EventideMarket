// import { supabase } from './supabase';

// export interface ListingPayload {
//   title: string;
//   description: string;
//   price: number;
//   image_url?: string | null;
//   category: string;
//   condition: string;
// }

// export const listingsService = {
//   async search(params?: { search?: string }) {
//     let q = supabase.from('listings').select('*').eq('is_available', true).order('created_at', { ascending: false });
//     if (params?.search) q = q.ilike('title', `%${params.search}%`);
//     const { data, error } = await q;
//     if (error) throw error;
//     return data ?? [];
//   },

//   async byUser(userId?: string) {
//     if (!userId) return [];
//     const { data, error } = await supabase.from('listings').select('*').eq('user_id', userId).order('created_at', { ascending: false });
//     if (error) throw error;
//     return data ?? [];
//   },

//   async get(id: string) {
//     const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
//     if (error) throw error;
//     return data;
//   },

//   async createListing(payload: ListingPayload) {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) throw new Error('Not authenticated');
//     const { data, error } = await supabase
//       .from('listings')
//       .insert({ ...payload, user_id: user.id })
//       .select()
//       .single();
//     if (error) throw error;
//     return data;
//   },

//   async updateListing(id: string, patch: Partial<ListingPayload>) {
//     const { data, error } = await supabase.from('listings').update({ ...patch }).eq('id', id).select().single();
//     if (error) throw error;
//     return data;
//   },

//   async deleteListing(id: string) {
//     const { error } = await supabase.from('listings').delete().eq('id', id);
//     if (error) throw error;
//   },
// };

import { supabase } from './supabase';

export interface ListingPayload {
  title: string;
  description: string;
  price: number;
  image_url?: string | null;
  category: string;
  condition: string;
}

const BASE = () =>
  supabase.from('listings').select('*').eq('is_available', true).order('created_at', { ascending: false });

export const listingsService = {
  // feed (không phân trang) — GIỮ để tương thích cũ
  async search(params?: { search?: string }) {
    let q = BASE();
    if (params?.search) q = q.ilike('title', `%${params.search}%`);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  // ✅ feed phân trang bằng keyset (created_at)
  async searchPage(opts?: { search?: string; limit?: number; cursorCreatedAt?: string | null }) {
    const limit = Math.max(1, Math.min(opts?.limit ?? 12, 50));
    let q = BASE();
    if (opts?.search) q = q.ilike('title', `%${opts.search}%`);
    if (opts?.cursorCreatedAt) q = q.lt('created_at', opts.cursorCreatedAt);
    q = q.limit(limit);

    const { data, error } = await q;
    if (error) throw error;
    const items = data ?? [];
    const last = items[items.length - 1];
    return { items, nextCursor: last ? last.created_at as string : null };
  },

  async byUser(userId?: string) {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async get(id: string) {
    const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async createListing(payload: ListingPayload) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('listings')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateListing(id: string, patch: Partial<ListingPayload>) {
    const { data, error } = await supabase.from('listings').update({ ...patch }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteListing(id: string) {
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) throw error;
  },
};
