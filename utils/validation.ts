export type FieldError = { field: string; message: string };

export function getFieldError(errors: FieldError[], field: string): string | undefined {
  return errors.find(e => e.field === field)?.message;
}

export function validateSignIn({ email, password }: { email: string; password: string; }) {
  const errors: FieldError[] = [];
  const looksLikeEmail = typeof email === 'string' && email.includes('@') && email.includes('.') && email.indexOf('@') > 0;
  if (!looksLikeEmail) errors.push({ field: 'email', message: 'Invalid email' });
  if (!password || password.length < 6) errors.push({ field: 'password', message: 'At least 6 characters' });
  return { isValid: errors.length === 0, errors };
}

export function validateSignUp({ email, password, confirmPassword, displayName }:
  { email: string; password: string; confirmPassword: string; displayName: string; }) {
  const errors: FieldError[] = [];
  if (!displayName || displayName.trim().length < 2) errors.push({ field: 'displayName', message: 'Please enter your name' });
  const base = validateSignIn({ email, password });
  errors.push(...base.errors);
  if (password !== confirmPassword) errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  return { isValid: errors.length === 0, errors };
}

export function validateListing({ title, description, price, category, condition }:
  { title: string; description: string; price: number; category: string; condition: string; }) {
  const errors: FieldError[] = [];
  if (!title || title.trim().length < 3) errors.push({ field: 'title', message: 'Title too short' });
  if (!description || description.trim().length < 10) errors.push({ field: 'description', message: 'Description too short' });
  if (!Number.isFinite(price) || price <= 0) errors.push({ field: 'price', message: 'Invalid price' });
  if (!category) errors.push({ field: 'category', message: 'Select category' });
  if (!condition) errors.push({ field: 'condition', message: 'Select condition' });
  return { isValid: errors.length === 0, errors };
}
