import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  ids: string[];
  loading: boolean;
  isFavorite: (listingId: string) => boolean;
  addFavorite: (listingId: string) => Promise<void>;
  removeFavorite: (listingId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) { setIds([]); return; }
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && mounted) setIds((data ?? []).map((r: any) => r.listing_id));
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  const isFavorite = (listingId: string) => ids.includes(listingId);

  const addFavorite = async (listingId: string) => {
    if (!user) throw new Error('Not authenticated');
    if (ids.includes(listingId)) return;
    setIds((prev) => [listingId, ...prev]); // optimistic
    const { error } = await supabase.from('favorites').insert({ user_id: user.id, listing_id: listingId });
    if (error) {
      setIds((prev) => prev.filter((id) => id != listingId)); // revert
      throw error;
    }
  };

  const removeFavorite = async (listingId: string) => {
    if (!user) throw new Error('Not authenticated');
    setIds((prev) => prev.filter((id) => id !== listingId)); // optimistic
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listingId);
    if (error) {
      setIds((prev) => (prev.includes(listingId) ? prev : [listingId, ...prev])); // best-effort revert
      throw error;
    }
  };

  const value = useMemo<FavoritesContextType>(
    () => ({ ids, loading, isFavorite, addFavorite, removeFavorite }),
    [ids, loading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavoritesContext = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return ctx;
};
