
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

/** Thông tin listing tối thiểu dùng khi hiển thị đơn */
export type ListingLite = {
  id: string;
  title: string;
  image_url: string | null;
};

/** Đơn mua (buyer xem “My orders”) */
export type PurchaseRow = {
  id: string;
  listing_id: string;
  buyer_id: string;
  price: number;
  created_at: string;
  listing: ListingLite | null; // có thể null nếu listing bị xoá
};

/** Đơn bán (seller xem “Customer’s orders”) */
export type SaleRow = PurchaseRow & {
  buyer_name: string; // tên người mua
};

export const purchasesService = {
  /**
   * My orders – đơn mà current user đã mua
   * YÊU CẦU: policy SELECT cho buyer_id trong Supabase (xem SQL phía dưới)
   */
  async listMine(): Promise<PurchaseRow[]> {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return [];

    // ⚠️ Dùng alias constraint để tránh mơ hồ quan hệ
    const { data, error } = await supabase
      .from('purchases')
      .select(
        `
        id, listing_id, buyer_id, price, created_at,
        listing:listings!purchases_listing_id_fkey (
          id, title, image_url
        )
      `
      )
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('listMine error', error);
      throw error;
    }

    // ép kiểu an toàn
    return (data ?? []) as unknown as PurchaseRow[];
  },

  /**
   * Customer’s orders – những đơn mà người khác mua CÁC listing do mình đăng
   * Cách làm an toàn 2 bước:
   * 1) Lấy tất cả listing_id thuộc về current user
   * 2) Truy vấn purchases với listing_id nằm trong danh sách đó
   * 3) Gắn buyer_name từ bảng profiles
   */
  async listForSeller(): Promise<SaleRow[]> {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id ?? '';
    if (!userId) return [];

    // 1) Lấy list listing do mình đăng
    const { data: listRows, error: listErr } = await supabase
      .from('listings')
      .select('id')
      .eq('user_id', userId);
    if (listErr) throw listErr;

    const listingIds = (listRows ?? []).map((r: any) => r.id);
    if (!listingIds.length) return []; // chưa đăng gì => chắc chắn chưa có ai mua

    // 2) Lấy purchases của các listing đó
    const { data: purchaseRows, error: purchaseErr } = await supabase
      .from('purchases')
      .select(
        `
        id, listing_id, buyer_id, price, created_at,
        listing:listings!purchases_listing_id_fkey (
          id, title, image_url
        )
      `
      )
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false });

    if (purchaseErr) throw purchaseErr;

    const arr = (purchaseRows ?? []) as unknown as PurchaseRow[];

    // 3) Lấy tên người mua theo buyer_id (gom mảng id để query một lần)
    const buyerIds = Array.from(new Set(arr.map((r) => r.buyer_id))).filter(Boolean);
    let buyerName = new Map<string, string>();
    if (buyerIds.length) {
      const { data: profs, error: profErr } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', buyerIds);
      if (profErr) throw profErr;
      buyerName = new Map((profs ?? []).map((p: any) => [p.id, p.display_name || '—']));
    }

    return arr.map((r) => ({
      ...r,
      buyer_name: buyerName.get(r.buyer_id) ?? '—',
    })) as SaleRow[];
  },

  /**
   * Tạo nhiều purchases cho current user (khi bấm Buy các item trong Favorites)
   * - Ghi nhận giá tại thời điểm mua (price snapshot)
   */
  async createMany(listingIds: string[]): Promise<void> {
    if (!listingIds.length) return;

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) throw new Error('Not authenticated');

    // Lấy giá hiện tại của listing để snapshot
    const { data: listRows, error: listErr } = await supabase
      .from('listings')
      .select('id, price')
      .in('id', listingIds);
    if (listErr) throw listErr;

    const rows =
      (listRows ?? []).map((r: any) => ({
        buyer_id: userId,
        listing_id: r.id,
        price: Number(r.price) || 0,
      })) ?? [];

    if (!rows.length) return;

    const { error: insertErr } = await supabase.from('purchases').insert(rows);
    if (insertErr) throw insertErr;
  },
};
