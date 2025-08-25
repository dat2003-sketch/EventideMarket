// types/purchases.ts

export type ListingBrief = {
  id: string;
  title: string;
  image_url: string | null;
};

export type PurchaseRow = {
  id: string;
  listing_id: string;
  buyer_id: string;
  price: number;
  created_at: string;

  // Thông tin người mua (lưu trong bảng purchases)
  buyer_name?: string | null;
  buyer_phone?: string | null;
  buyer_address?: string | null;
  buyer_note?: string | null;

  // Hiển thị thêm khi là Seller xem đơn (join từ profiles)
  buyer_display_name?: string | null;

  // Gắn vào khi render UI
  listing: ListingBrief | null;
};

export type SaleRow = PurchaseRow;

// Payload người mua điền ở form “Shipping info”
export type ShippingInfo = {
  receiver_name?: string;
  phone?: string;
  address?: string;
  note?: string;
};
