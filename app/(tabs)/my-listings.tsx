

// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { View } from 'react-native';
// import ListingGrid from '../../components/listings/ListingGrid';
// import { useAuth } from '../../contexts/AuthContext';
// import { useUserListings } from '../../hooks/useListings';
// import { listingsService } from '../../services/listings';
// import { useRouter } from 'expo-router';
// import { Button } from '../../components/common/Button';
// import { globalStyles } from '../../styles/globalStyles';

// export default function MyListings() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { listings, loading, refetch } = useUserListings(user?.id);

//   const onDelete = async (id: string) => {
//     await listingsService.deleteListing(id);
//     await refetch();
//   };

//   const header = (
//     <View style={{ paddingVertical: 8 }}>
//       <Button title="Create new" onPress={() => router.push('/(tabs)/sell')} />
//     </View>
//   );

//   return (
//     <SafeAreaView style={globalStyles.safeContainer}>
//       <ListingGrid
//         items={listings}
//         loading={loading}
//         editable
//         ownerId={user?.id}
//         onDelete={onDelete}
//         ListHeaderComponent={header}   // ✅ nút Create đứng trước grid
//       />
//     </SafeAreaView>
//   );
// }

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useUserListings } from '../../hooks/useListings';
import { listingsService } from '../../services/listings';
import ListingGrid from '../../components/listings/ListingGrid';
import ScreenHeader from '../../components/common/ScreenHeader';
import { GRADIENTS } from '../../utils/constants';
import { Button } from '../../components/common/Button';

export default function MyListings() {
  const { user } = useAuth();
  const router = useRouter();
  const { listings, loading, refetch } = useUserListings(user?.id);

  const onDelete = async (id: string) => {
    try {
      await listingsService.deleteListing(id);
      await refetch();
    } catch (e: any) {
      Alert.alert('Delete failed', e?.message || 'Try again');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ListingGrid
        items={listings}
        loading={loading}
        editable
        onDelete={onDelete}
        // 👉 chèn header vào chính FlatList để không bị nested
        ListHeaderComponent={
          <View style={{ marginBottom: 8 }}>
            <ScreenHeader
              title="My Listings"
              subtitle="Manage your items"
              colors={GRADIENTS.myListings}
            />
            <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
              <Button title="Create new" onPress={() => router.push('/(tabs)/sell')} />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
