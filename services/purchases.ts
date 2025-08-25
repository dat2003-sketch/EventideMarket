// // services/purchases.ts
// import { supabase } from './supabase';

// /** Thông tin rút gọn của listing hiển thị ở đơn */
// export type ListingBrief = {
//   id: string;
//   title: string;
//   image_url: string | null;
// };

// /** 1 dòng purchase cho cả buyer/seller xem */
// export type PurchaseRow = {
//   id: string;
//   listing_id: string;
//   buyer_id: string;
//   price: number;
//   created_at: string;

//   // thông tin người mua (nhập từ form)
//   buyer_name?: string | null;
//   buyer_phone?: string | null;
//   buyer_address?: string | null;
//   buyer_note?: string | null;

//   // attach để hiển thị
//   listing?: ListingBrief | null;
// };
// export type SaleRow = PurchaseRow;

// /** Payload form người mua (không còn payment) */
// export type BuyerInfo = {
//   name: string;
//   phone: string;
//   address: string;
//   note?: string;
// };

// export const purchasesService = {
//   // Buyer: đơn của tôi
//   async listMine(): Promise<PurchaseRow[]> {
//     const { data: auth } = await supabase.auth.getUser();
//     const userId = auth.user?.id ?? '';
//     if (!userId) return [];

//     const { data, error } = await supabase
//       .from('purchases')
//       .select(
//         'id, listing_id, buyer_id, price, created_at, buyer_name, buyer_phone, buyer_address, buyer_note'
//       )
//       .eq('buyer_id', userId)
//       .order('created_at', { ascending: false });
//     if (error) throw error;

//     const rows = (data ?? []).map((r: any) => ({
//       ...r,
//       price: Number(r.price),
//     })) as PurchaseRow[];
//     if (!rows.length) return [];

//     // attach ListingBrief
//     const ids = Array.from(
//       new Set(rows.map((r) => r.listing_id).filter((v): v is string => !!v))
//     );
//     if (!ids.length) return rows;

//     const { data: listingData, error: listErr } = await supabase
//       .from('listings')
//       .select('id, title, image_url')
//       .in('id', ids);
//     if (listErr) throw listErr;

//     const map = new Map<string, ListingBrief>(
//       (listingData ?? []).map((l: any) => [
//         l.id as string,
//         { id: l.id, title: l.title, image_url: l.image_url ?? null },
//       ])
//     );
//     rows.forEach((r) => (r.listing = map.get(r.listing_id) ?? null));
//     return rows;
//   },

//   // Seller: đơn của khách mua các listing của tôi
//   async listForSeller(): Promise<SaleRow[]> {
//     const { data: auth } = await supabase.auth.getUser();
//     const userId = auth.user?.id ?? '';
//     if (!userId) return [];

//     // các listing do tôi đăng
//     const { data: myListings, error: listErr } = await supabase
//       .from('listings')
//       .select('id, title, image_url')
//       .eq('user_id', userId);
//     if (listErr) throw listErr;
//     if (!myListings?.length) return [];

//     const listingIds = myListings.map((l: any) => l.id as string);

//     // purchases thuộc các listing đó
//     const { data: purchaseRows, error: pErr } = await supabase
//       .from('purchases')
//       .select(
//         'id, listing_id, buyer_id, price, created_at, buyer_name, buyer_phone, buyer_address, buyer_note'
//       )
//       .in('listing_id', listingIds)
//       .order('created_at', { ascending: false });
//     if (pErr) throw pErr;

//     const rows = (purchaseRows ?? []).map((r: any) => ({
//       ...r,
//       price: Number(r.price),
//     })) as SaleRow[];

//     const lmap = new Map<string, ListingBrief>(
//       (myListings ?? []).map((l: any) => [
//         l.id as string,
//         { id: l.id, title: l.title, image_url: l.image_url ?? null },
//       ])
//     );
//     rows.forEach((r) => (r.listing = lmap.get(r.listing_id) ?? null));
//     return rows;
//   },

//   // Tạo nhiều purchases cho các listingId đã chọn, lưu kèm thông tin người mua
//   async createMany(listingIds: string[], info: BuyerInfo): Promise<void> {
//     if (!listingIds?.length) return;

//     const { data: auth } = await supabase.auth.getUser();
//     const userId = auth.user?.id;
//     if (!userId) throw new Error('Not authenticated');

//     // lấy giá của từng listing
//     const { data: listings, error: lerr } = await supabase
//       .from('listings')
//       .select('id, price')
//       .in('id', listingIds);
//     if (lerr) throw lerr;

//     const priceMap = new Map<string, number>(
//       (listings ?? []).map((l: any) => [l.id as string, Number(l.price)])
//     );

//     const payload = listingIds.map((id) => ({
//       listing_id: id,
//       buyer_id: userId,
//       price: priceMap.get(id) ?? 0,
//       buyer_name: info.name ?? null,
//       buyer_phone: info.phone ?? null,
//       buyer_address: info.address ?? null,
//       buyer_note: info.note ?? null,
//     }));

//     const { error } = await supabase.from('purchases').insert(payload);
//     if (error) throw error;
//   },
// };
// services/purchases.ts
// services/purchases.ts


import { supabase } from './supabase';

/** Hiển thị kèm trong orders/sales */
export type ListingBrief = {
  id: string;
  title: string;
  image_url: string | null;
};

/** Một dòng purchase cho cả buyer & seller thấy */
export type PurchaseRow = {
  id: string;
  listing_id: string;
  buyer_id: string;
  price: number;
  created_at: string;

  // Thông tin người mua nhập ở form
  buyer_name?: string | null;
  buyer_phone?: string | null;
  buyer_address?: string | null;
  buyer_note?: string | null;

  // Fallback: display_name lấy từ profiles (listForSeller sẽ gán)
  buyer_display_name?: string | null;

  // Attach để hiển thị
  listing: ListingBrief | null;
};

export type SaleRow = PurchaseRow;

/** Payload từ form mua hàng */
export type BuyerInfo = {
  name: string;
  phone?: string;
  address?: string;
  note?: string;
};

export const purchasesService = {
  /** Đơn của tôi (buyer) */
  async listMine(): Promise<PurchaseRow[]> {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id ?? '';
    if (!userId) return [];

    // 1) lấy purchases của tôi
    const { data, error } = await supabase
      .from('purchases')
      .select(
        'id, listing_id, buyer_id, price, created_at, buyer_name, buyer_phone, buyer_address, buyer_note'
      )
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    const rows = (data ?? []) as PurchaseRow[];
    if (!rows.length) return [];

    // 2) map listing info
    const ids = [...new Set(rows.map(r => r.listing_id))];
    const { data: listingData, error: listErr } = await supabase
      .from('listings')
      .select('id, title, image_url')
      .in('id', ids);

    if (listErr) throw listErr;
    const lmap = new Map((listingData ?? []).map((l: any) => [l.id, l as ListingBrief]));
    rows.forEach(r => { r.listing = lmap.get(r.listing_id) ?? null; });

    return rows;
  },

  /** Customer’s orders: người khác mua các listing do MÌNH đăng */
  async listForSeller(): Promise<SaleRow[]> {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id ?? '';
    if (!userId) return [];

    // 1) các listing tôi đăng
    const { data: myListings, error: listErr } = await supabase
      .from('listings')
      .select('id, title, image_url')
      .eq('user_id', userId);

    if (listErr) throw listErr;
    if (!myListings?.length) return [];

    const ids = myListings.map((l: any) => l.id);

    // 2) purchases thuộc các listing đó
    const { data: purchaseRows, error: pErr } = await supabase
      .from('purchases')
      .select(
        'id, listing_id, buyer_id, price, created_at, buyer_name, buyer_phone, buyer_address, buyer_note'
      )
      .in('listing_id', ids)
      .order('created_at', { ascending: false });

    if (pErr) throw pErr;

    const rows = (purchaseRows ?? []) as SaleRow[];

    // 3) attach listing
    const lmap = new Map(myListings.map((l: any) => [l.id, l as ListingBrief]));
    rows.forEach(r => { r.listing = lmap.get(r.listing_id) ?? null; });

    // 4) map thêm display_name từ profiles (fallback hiển thị "by ...")
    const buyerIds = [...new Set(rows.map(r => r.buyer_id))];
    if (buyerIds.length) {
      const { data: profs, error: profErr } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', buyerIds);
      if (profErr) throw profErr;
      const pmap = new Map((profs ?? []).map((p: any) => [p.id, p.display_name as string | null]));
      rows.forEach(r => { r.buyer_display_name = pmap.get(r.buyer_id) ?? null; });
    }

    return rows;
  },

  /** Tạo nhiều purchases cho các listing đã chọn (không còn payment) */
  async createMany(listingIds: string[], info: BuyerInfo): Promise<void> {
    if (!listingIds.length) return;

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id ?? '';
    if (!userId) throw new Error('Not authenticated');

    // Lấy price của từng listing
    const { data: listingData, error: lerr } = await supabase
      .from('listings')
      .select('id, price')
      .in('id', listingIds);

    if (lerr) throw lerr;
    const priceMap = new Map((listingData ?? []).map((l: any) => [l.id, Number(l.price) || 0]));

    // Build payload
    const payload = listingIds
      .map((lid) => {
        const price = priceMap.get(lid);
        if (price == null) return null;
        return {
          listing_id: lid,
          buyer_id: userId,
          price,
          // thông tin người mua nhập
          buyer_name: info.name ?? null,
          buyer_phone: info.phone ?? null,
          buyer_address: info.address ?? null,
          buyer_note: info.note ?? null,
        };
      })
      .filter(Boolean) as any[];

    if (!payload.length) throw new Error('No valid items to purchase');

    const { error: insErr } = await supabase.from('purchases').insert(payload);
    if (insErr) throw insErr;

    // Không bắt buộc: có thể xoá khỏi favorites ở UI sau khi mua xong
  },
};
