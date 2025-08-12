// utils/validation.ts
import { CONDITIONS, type ConditionValue } from './constants';

export type FieldError = { field: string; message: string };
export const getFieldError = (errors: FieldError[], field: string) =>
  errors.find((e) => e.field === field)?.message ?? '';

// ---------- Auth ----------
export function validateSignIn(input: { email: string; password: string }) {
  const errors: FieldError[] = [];
  if (!input.email?.trim()) errors.push({ field: 'email', message: 'Email is required' });
  if (!input.password?.trim()) errors.push({ field: 'password', message: 'Password is required' });
  return { isValid: errors.length === 0, errors };
}

export function validateSignUp(input: {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}) {
  const errors: FieldError[] = [];
  const { email, password, confirmPassword, displayName } = input;

  if (!displayName || displayName.trim().length < 2)
    errors.push({ field: 'displayName', message: 'Please enter at least 2 characters' });

  if (!email?.trim()) errors.push({ field: 'email', message: 'Email is required' });

  if (!password?.trim()) errors.push({ field: 'password', message: 'Password is required' });
  if (password !== confirmPassword)
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });

  return { isValid: errors.length === 0, errors };
}

// ---------- Listing ----------
export function validateListing(input: {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ConditionValue;
}) {
  const errors: FieldError[] = [];
  const { title, description, price, category, condition } = input;

  if (!title?.trim()) errors.push({ field: 'title', message: 'Title is required' });
  if (!description?.trim())
    errors.push({ field: 'description', message: 'Description is required' });
  if (!Number.isFinite(price) || price <= 0)
    errors.push({ field: 'price', message: 'Price must be greater than 0' });
  if (!category?.trim()) errors.push({ field: 'category', message: 'Category is required' });

 
  if (!CONDITIONS.some((c) => c.value === condition))
    errors.push({ field: 'condition', message: 'Invalid condition' });

  return { isValid: errors.length === 0, errors };
}
