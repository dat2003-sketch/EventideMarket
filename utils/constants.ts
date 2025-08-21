// utils/constants.ts

// ===== Categories =====
export const CATEGORIES = [
  'Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Other',
] as const;
export type Category = typeof CATEGORIES[number];

// ===== Conditions =====
export const CONDITIONS = [
  { label: 'New',      value: 'new' },
  { label: 'Like New', value: 'like_new' },
  { label: 'Good',     value: 'good' },
  { label: 'Fair',     value: 'fair' },
] as const;
export type ConditionValue = (typeof CONDITIONS)[number]['value'];

// ===== UI tokens =====
export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 } as const;
export const BORDER_RADIUS = { sm: 8, md: 12, lg: 16 } as const;

// Không đổi các key cũ để an toàn với code hiện tại
export const COLORS = {
  primary: '#2563eb',
  error: '#dc2626',
  shadow: '#000',
  border: '#e2e8f0',
  background: {
    app: '#f8fafc',       // nền app tổng thể
    primary: '#ffffff',
    secondary: '#f1f5f9',
    tertiary: '#e2e8f0',
  },
  text: { primary: '#0f172a', secondary: '#334155', tertiary: '#64748b' },
} as const;

// ===== Brand gradients cho từng screen =====
export const GRADIENTS = {
  market: ['#0ea5e9', '#6366f1'] as const,     // cyan -> indigo
  sell: ['#22c55e', '#16a34a'] as const,       // green
  myListings: ['#f59e0b', '#ef4444'] as const, // amber -> red
  profile: ['#a855f7', '#6366f1'] as const,    // purple -> indigo
} as const;

export const STORAGE_BUCKET = 'listing-images';
