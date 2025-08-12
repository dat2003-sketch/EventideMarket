import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import ListingGrid from '../../components/listings/ListingGrid';
import { globalStyles } from '../../styles/globalStyles';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: favs, error } = await supabase
        .from('favorites')
        .select('listing_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const ids = (favs ?? []).map((f: any) => f.listing_id);
      if (ids.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const { data: ls, error: e2 } = await supabase
        .from('listings')
        .select('*')
        .in('id', ids);

      if (e2) throw e2;

      // Giữ đúng thứ tự theo favorites
      const orderMap = new Map(ids.map((id: string, i: number) => [id, i]));
      const sorted = (ls ?? []).sort(
        (a: any, b: any) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0)
      );
      setItems(sorted);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Cannot load favorites');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={globalStyles.safeContainer}>
      <View style={{ flex: 1 }}>
        <ListingGrid
          items={items}
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </View>
    </SafeAreaView>
  );
}
