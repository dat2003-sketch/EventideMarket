-- PROFILES
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- LISTINGS
create policy "listings_select_all" on public.listings for select using (true);
create policy "listings_insert_auth" on public.listings for insert with check (auth.uid() = user_id);
create policy "listings_update_own" on public.listings for update using (auth.uid() = user_id);
create policy "listings_delete_own" on public.listings for delete using (auth.uid() = user_id);

-- FAVORITES
create policy "favorites_select_own" on public.favorites for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites for delete using (auth.uid() = user_id);