create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Listings
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric not null check (price > 0),
  image_url text,
  category text not null,
  condition text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_available boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Favorites
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, listing_id)
);

-- Helpful view permissions
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.favorites enable row level security;