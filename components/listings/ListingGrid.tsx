
// import { useRouter } from 'expo-router';
// import React from 'react';
// import { ActivityIndicator, FlatList } from 'react-native';
// import ListingCard from './ListingCard';

// interface Props {
//   items: any[];
//   loading?: boolean;
//   editable?: boolean;
//   ownerId?: string;
//   onDelete?: (id: string) => void;
//   refreshing?: boolean;
//   onRefresh?: () => void;
//   onEndReached?: () => void;
//   loadingMore?: boolean;
//   ListHeaderComponent?: React.ReactElement | null;
// }

// export default function ListingGrid({
//   items,
//   loading,
//   editable,
//   onDelete,
//   refreshing,
//   onRefresh,
//   onEndReached,
//   loadingMore,
//   ListHeaderComponent,
// }: Props) {
//   const router = useRouter();

//   if (loading && (!items || items.length === 0)) return <ActivityIndicator style={{ padding: 24 }} />;

//   return (
//     <FlatList
//       data={items}
//       keyExtractor={(i) => i.id}
//       renderItem={({ item }) => (
//         <ListingCard
//           item={item}
//           editable={editable}
//           onPress={() => router.push(`/listing/${item.id}`)}
//           onEdit={() => router.push(`/listing/edit/${item.id}`)}
//           onDelete={() => onDelete?.(item.id)}
//         />
//       )}
//       numColumns={2}
//       columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 14 }}
//       contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
//       ListHeaderComponent={ListHeaderComponent ?? null}
//       refreshing={refreshing}
//       onRefresh={onRefresh}
//       onEndReached={onEndReached}
//       onEndReachedThreshold={0.4}
//       ListFooterComponent={
//         loadingMore ? <ActivityIndicator style={{ paddingVertical: 12 }} /> : null
//       }
//     />
//   );
// }

import React from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import ListingCard from './ListingCard';
import { useRouter } from 'expo-router';

interface Props {
  items: any[];
  loading?: boolean;
  editable?: boolean;
  onDelete?: (id: string) => void;
  ListHeaderComponent?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
}

export default function ListingGrid({
  items, loading, editable, onDelete,
  ListHeaderComponent, refreshing, onRefresh, onEndReached,
}: Props) {
  const router = useRouter();
  if (loading) return <ActivityIndicator />;

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <ListingCard
          item={item}
          editable={editable}
          onPress={() => router.push(`/listing/${item.id}`)}
          onEdit={() => router.push(`/listing/edit/${item.id}`)}
          onDelete={() => onDelete?.(item.id)}
        />
      )}
      ListHeaderComponent={ListHeaderComponent ?? null}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 }}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReachedThreshold={0.2}
      onEndReached={onEndReached}
    />
  );
}
