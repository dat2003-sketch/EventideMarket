
// import React from 'react';
// import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import ListingGrid from '../../components/listings/ListingGrid';
// import Header from '../../components/market/Header';
// import { useListings } from '../../hooks/useListings';

// export default function Market() {
//   const { listings, loading, refreshing, onRefresh, loadMore, loadingMore } =
//     useListings({ pageSize: 12 });

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//       <Header />

//       <ScrollView
//         contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
//         refreshControl={undefined}
//       >
//         {/* Hero */}
//         <View style={styles.hero}>
//           <Text style={styles.heroTitle}>Discover Artisan Goods</Text>
//           <Text style={styles.heroSubtitle}>
//             A curated collection of handmade items from talented creators around the world.
//           </Text>
//         </View>

//         {/* Grid feed */}
//         <View style={{ marginTop: 8 }}>
//           <ListingGrid
//             items={listings}
//             loading={loading}
//             // nếu bạn đang dùng pull-to-refresh riêng thì truyền vào 3 prop dưới:
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             // infinite scroll
//             onDelete={undefined}
//           />
//           {/* Nếu ListingGrid của bạn hỗ trợ onEndReached/ loadingMore thì vẫn chạy bình thường */}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   hero: { paddingVertical: 20, alignItems: 'center' },
//   heroTitle: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#0f172a',
//     textAlign: 'center',
//     letterSpacing: 0.2,
//   },
//   heroSubtitle: {
//     marginTop: 8,
//     fontSize: 14,
//     lineHeight: 20,
//     color: '#475569',
//     textAlign: 'center',
//     maxWidth: 560,
//   },
// });

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import { useListings } from '../../hooks/useListings';
import ListingGrid from '../../components/listings/ListingGrid';
import Header from '../../components/market/Header';

export default function Market() {
  const { listings, loading, refreshing, onRefresh, loadMore, loadingMore } =
    useListings({ pageSize: 12 });

  const hero = (
    <View style={styles.hero}>
      <Text style={styles.heroTitle}>Discover Artisan Goods</Text>
      <Text style={styles.heroSubtitle}>
        A curated collection of handmade items from talented creators around the world.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      <ListingGrid
        items={listings}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={loadMore}
        loadingMore={loadingMore}
        ListHeaderComponent={hero}   // ✅ hero sẽ cuộn cùng list
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: 12, paddingBottom: 8, alignItems: 'center' },
  heroTitle: {
    fontSize: 28, fontWeight: '800', color: '#0f172a',
    textAlign: 'center', letterSpacing: 0.2, paddingHorizontal: 16,
  },
  heroSubtitle: {
    marginTop: 8, fontSize: 14, lineHeight: 20, color: '#475569',
    textAlign: 'center', maxWidth: 560, paddingHorizontal: 16,
  },
});
