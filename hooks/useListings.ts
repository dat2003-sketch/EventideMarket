// import { useCallback, useEffect, useState } from 'react';
// import { listingsService } from '../services/listings';
// import { useAuth } from '../contexts/AuthContext';
// import { useFocusEffect } from 'expo-router';

// export function useListings(params?: { search?: string }) {
//   const [listings, setListings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await listingsService.search(params);
//       setListings(data);
//     } finally {
//       setLoading(false);
//     }
//   }, [params?.search]);

//   useEffect(() => { load(); }, [load]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try { await load(); } finally { setRefreshing(false); }
//   }, [load]);

//   return { listings, loading, refreshing, onRefresh, refetch: load };
// }

// export function useUserListings(passedUserId?: string) {
//   const { user } = useAuth();
//   const userId = passedUserId ?? user?.id;

//   const [listings, setListings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const load = useCallback(async () => {
//     if (!userId) { setListings([]); setLoading(false); return; }
//     setLoading(true);
//     try {
//       const data = await listingsService.byUser(userId);
//       setListings(data);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => { load(); }, [load]);
//   useFocusEffect(useCallback(() => { load(); }, [load]));

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     try { await load(); } finally { setRefreshing(false); }
//   }, [load]);

//   return { listings, loading, refreshing, onRefresh, refetch: load, userId };
// }

// export function useListing(id?: string) {
//   const [listing, setListing] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);

//   const load = useCallback(async () => {
//     if (!id) { setListing(null); setLoading(false); return; }
//     setLoading(true);
//     try {
//       const data = await listingsService.get(id);
//       setListing(data);
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => { load(); }, [load]);

//   const refetch = useCallback(load, [load]);

//   return { listing, loading, refetch };
// }

import { useCallback, useEffect, useState } from 'react';
import { listingsService } from '../services/listings';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from 'expo-router';

// ✅ Market feed có phân trang + pull-to-refresh
export function useListings(params?: { search?: string; pageSize?: number }) {
  const pageSize = params?.pageSize ?? 12;

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    try {
      const { items, nextCursor } = await listingsService.searchPage({
        search: params?.search,
        limit: pageSize,
      });
      setListings(items);
      setCursor(nextCursor);
      setHasMore(Boolean(nextCursor));
    } finally {
      setLoading(false);
    }
  }, [params?.search, pageSize]);

  useEffect(() => { loadFirstPage(); }, [loadFirstPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadFirstPage();
    } finally {
      setRefreshing(false);
    }
  }, [loadFirstPage]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return;
    setLoadingMore(true);
    try {
      const { items, nextCursor } = await listingsService.searchPage({
        search: params?.search,
        limit: pageSize,
        cursorCreatedAt: cursor,
      });
      setListings((prev) => [...prev, ...items]);
      setCursor(nextCursor);
      setHasMore(Boolean(nextCursor));
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, loading, params?.search, pageSize, cursor]);

  return { listings, loading, refreshing, onRefresh, loadMore, loadingMore, hasMore, refetch: loadFirstPage };
}

// GIỮ NGUYÊN: dùng cho My Listings / User page
export function useUserListings(passedUserId?: string) {
  const { user } = useAuth();
  const userId = passedUserId ?? user?.id;

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!userId) { setListings([]); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await listingsService.byUser(userId);
      setListings(data);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await load(); } finally { setRefreshing(false); }
  }, [load]);

  return { listings, loading, refreshing, onRefresh, refetch: load, userId };
}

export function useListing(id?: string) {
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) { setListing(null); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await listingsService.get(id);
      setListing(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const refetch = useCallback(load, [load]);
  return { listing, loading, refetch };
}
