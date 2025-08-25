// app/(tabs)/index.tsx
import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeatherBadge from '../../components/common/WeatherBadge';
import ListingGrid from '../../components/listings/ListingGrid';
import HomeHeaderSimple from '../../components/market/HomeHeaderSimple';
import { useListings } from '../../hooks/useListings';
import type { ConditionValue } from '../../utils/constants';

export default function Market() {
  const { listings, loading, refreshing, onRefresh, loadMore, loadingMore } =
    useListings({ pageSize: 12 });

  const [query, setQuery] = useState('');
  const [condition, setCondition] = useState<ConditionValue | null>(null);
  const [sort, setSort] = useState<'asc' | 'desc' | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = (listings || []).filter((it: any) => {
      if (condition && String(it.condition) !== condition) return false;
      if (!q) return true;
      return (
        String(it.title ?? '').toLowerCase().includes(q) ||
        String(it.description ?? '').toLowerCase().includes(q)
      );
    });
    if (sort === 'asc') arr = [...arr].sort((a: any, b: any) => Number(a.price) - Number(b.price));
    if (sort === 'desc') arr = [...arr].sort((a: any, b: any) => Number(b.price) - Number(a.price));
    return arr;
  }, [listings, query, condition, sort]);

  const header = (
  <>
    <WeatherBadge />
    <HomeHeaderSimple
      query={query}
      onChangeQuery={setQuery}
      condition={condition}
      onSelectCondition={setCondition}
      sort={sort}
      onToggleSort={() => setSort((s) => (s === 'asc' ? 'desc' : s === 'desc' ? null : 'asc'))}
    />
  </>
);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ListingGrid
        items={filtered}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        loadingMore={loadingMore}
        ListHeaderComponent={header}
      />
    </SafeAreaView>
  );
}
