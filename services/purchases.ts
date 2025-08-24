
// import { supabase } from './supabase';

// /** Bản ghi purchase + embed listing */
// export type PurchaseRow = {
//   id: string;
//   listing_id: string;
//   buyer_id: string;
//   price: number;
//   created_at: string;
//   listing?: {
//     id: string;
//     title: string;
//     image_url: string | null;
//     user_id: string;
//   } | null;
// };

// export const purchasesService = {
//   /** Đơn đã mua (vai trò BUYER) */
//   async listMine(): Promise<PurchaseRow[]> {
//     const { data: u } = await supabase.auth.getUser();
//     const userId = u?.user?.id ?? '';
//     if (!userId) return [];

//     const { data, error } = await supabase
//       .from('purchases')
//       .select(
//         `
//         id,
//         listing_id,
//         buyer_id,
//         price,
//         created_at,
//         listing:listings!purchases_listing_id_fkey (
//           id, title, image_url, user_id
//         )
//       `
//       )
//       .eq('buyer_id', userId)
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     return (data ?? []) as unknown as PurchaseRow[];
//   },

//   /** Đơn của KHÁCH HÀNG mua các listing do TÔI đăng (vai trò SELLER) */
//   async listForSeller(): Promise<PurchaseRow[]> {
//     const { data: u } = await supabase.auth.getUser();
//     const userId = u?.user?.id ?? '';
//     if (!userId) return [];

//     const { data, error } = await supabase
//       .from('purchases')
//       .select(
//         `
//         id,
//         listing_id,
//         buyer_id,
//         price,
//         created_at,
//         listing:listings!purchases_listing_id_fkey (
//           id, title, image_url, user_id
//         )
//       `
//       )
//       // lọc theo owner của listing (trên bản embed)
//       .eq('listing.user_id', userId)
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     return (data ?? []) as unknown as PurchaseRow[];
//   },

//   /** Tạo nhiều purchase từ danh sách listingIds người dùng chọn để mua */
//   async createMany(listingIds: string[]): Promise<void> {
//     if (!listingIds?.length) return;

//     const { data: u } = await supabase.auth.getUser();
//     const buyerId = u?.user?.id ?? '';
//     if (!buyerId) throw new Error('Not authenticated');

//     // Lấy đúng giá của listing để ghi vào purchase
//     const { data: listings, error: e1 } = await supabase
//       .from('listings')
//       .select('id, price')
//       .in('id', listingIds);

//     if (e1) throw e1;

//     const rows = (listings ?? []).map((l: any) => ({
//       listing_id: l.id,
//       buyer_id: buyerId,
//       price: Number(l.price), // đảm bảo là number
//     }));

//     const { error } = await supabase.from('purchases').insert(rows);
//     if (error) throw error;
//   },
// };

// services/purchases.ts
import { supabase } from './supabase';

// Dòng type dùng chung cho "đơn đã mua" (của current user)
export type PurchaseRow = {
  id: string;
  listing_id: string;
  price: number;
  created_at: string;
  // thông tin listing có thể null nếu listing đã bị xóa
  listing: {
    id: string;
    title: string;
    image_url: string | null;
  } | null;
};

// Dòng type cho "customer's orders" (người khác mua hàng của mình)
export type SaleRow = PurchaseRow & {
  buyer_id: string;
  buyer_name: string | null; // map từ bảng profiles
};

export const purchasesService = {
  // Đơn do current user đã mua
  async listMine(): Promise<PurchaseRow[]> {
    const { data: u } = await supabase.auth.getUser();
    const userId = u?.user?.id ?? '';
    if (!userId) return [];

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        id,
        listing_id,
        price,
        created_at,
        listing:listings!purchases_listing_id_fkey (
          id, title, image_url
        )
      `)
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // cast an toàn: unknown -> PurchaseRow[]
    return (data ?? []) as unknown as PurchaseRow[];
  },

  // Các đơn hàng mà NGƯỜI KHÁC đã mua các listing của MÌNH
  async listForSeller(): Promise<SaleRow[]> {
    const { data: u } = await supabase.auth.getUser();
    const userId = u?.user?.id ?? '';
    if (!userId) return [];

    // 1) lấy tất cả listing_id do mình đăng
    const { data: myListings, error: lErr } = await supabase
      .from('listings')
      .select('id')
      .eq('user_id', userId);

    if (lErr) throw lErr;

    const ids = (myListings ?? []).map((r: any) => r.id);
    if (!ids.length) return [];

    // 2) lấy purchases của các listing đó
    const { data, error: pErr } = await supabase
      .from('purchases')
      .select(`
        id,
        listing_id,
        price,
        created_at,
        buyer_id,
        listing:listings!purchases_listing_id_fkey (
          id, title, image_url
        )
      `)
      .in('listing_id', ids)
      .order('created_at', { ascending: false });

    if (pErr) throw pErr;

    const base = (data ?? []) as unknown as Array<
      Omit<SaleRow, 'buyer_name'>
    >;

    if (!base.length) return base.map(r => ({ ...r, buyer_name: null }));

    // 3) map buyer_id -> display_name/email
    const buyerIds = Array.from(new Set(base.map(r => r.buyer_id))).filter(Boolean);
    const { data: profiles, error: profErr } = await supabase
      .from('profiles')
      .select('id, display_name, email')
      .in('id', buyerIds);

    if (profErr) throw profErr;

    const nameMap = new Map<string, string>();
    (profiles ?? []).forEach((p: any) =>
      nameMap.set(p.id, p.display_name || p.email || '—')
    );

    return base.map(r => ({ ...r, buyer_name: nameMap.get(r.buyer_id) ?? null }));
  },

  // Tạo nhiều purchase cho danh sách listing đã chọn (nút Buy)
  async createMany(listingIds: string[]): Promise<void> {
    if (!listingIds.length) return;

    const { data: u } = await supabase.auth.getUser();
    const user = u?.user;
    if (!user) throw new Error('Not authenticated');

    // lấy giá của listing để chốt đơn
    const { data: ls, error: lErr } = await supabase
      .from('listings')
      .select('id, price')
      .in('id', listingIds);

    if (lErr) throw lErr;

    const payload = (ls ?? []).map((r: any) => ({
      buyer_id: user.id,
      listing_id: r.id,
      price: Number(r.price) || 0,
    }));

    const { error } = await supabase.from('purchases').insert(payload);
    if (error) throw error;
  },
};
