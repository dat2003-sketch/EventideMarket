export function formatPrice(n: number | string): string {
  const num = typeof n === 'string' ? Number(n) : n;
  if (!isFinite(num)) return '';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

export function formatCondition(value: string): string {
  switch (value) {
    case 'new': return 'New';
    case 'like_new': return 'Like New';
    case 'good': return 'Good';
    case 'fair': return 'Fair';
    case 'poor': return 'Poor';
    default: return value;
  }
}

export function truncate(s: string, max: number): string {
  if (!s) return '';
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}
