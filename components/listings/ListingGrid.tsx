

// import React from 'react';
// import { View, ActivityIndicator, FlatList, Text } from 'react-native';
// import ListingCard from './ListingCard';
// import { useRouter } from 'expo-router';

// interface Props {
//   items: any[];
//   loading?: boolean;
//   editable?: boolean;
//   ownerId?: string;
//   onDelete?: (id: string) => void;

//   // ✅ thêm các props cho pull-to-refresh & infinite scroll & header
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

//   if (loading && (!items || items.length === 0)) {
//     return (
//       <View style={{ paddingVertical: 24 }}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   if (!loading && (!items || items.length === 0)) {
//     return (
//       <View style={{ alignItems: 'center', paddingVertical: 24 }}>
//         <Text>No items</Text>
//       </View>
//     );
//   }

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
//       columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
//       contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
//       // ✅ header/refresh/load-more
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

import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import ListingCard from './ListingCard';

interface Props {
  items: any[];
  loading?: boolean;
  editable?: boolean;
  ownerId?: string;
  onDelete?: (id: string) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
  ListHeaderComponent?: React.ReactElement | null;
}

export default function ListingGrid({
  items,
  loading,
  editable,
  onDelete,
  refreshing,
  onRefresh,
  onEndReached,
  loadingMore,
  ListHeaderComponent,
}: Props) {
  const router = useRouter();

  if (loading && (!items || items.length === 0)) return <ActivityIndicator style={{ padding: 24 }} />;

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
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 14 }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      ListHeaderComponent={ListHeaderComponent ?? null}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator style={{ paddingVertical: 12 }} /> : null
      }
    />
  );
}
