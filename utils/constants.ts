export const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Other'] as const;

export const CONDITIONS = [
  { label: 'New', value: 'new' },
  { label: 'Like New', value: 'like_new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Poor', value: 'poor' },
] as const;

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 } as const;
export const BORDER_RADIUS = { sm: 8, md: 12, lg: 16 } as const;

export const COLORS = {
  primary: '#2563eb',
  error: '#dc2626',
  shadow: '#000',
  border: '#e2e8f0',
  background: { app: '#f8fafc', primary: '#ffffff', secondary: '#f1f5f9', tertiary: '#e2e8f0' },
  text: { primary: '#0f172a', secondary: '#334155', tertiary: '#64748b' },
} as const;

export const STORAGE_BUCKET = 'listing-images';
