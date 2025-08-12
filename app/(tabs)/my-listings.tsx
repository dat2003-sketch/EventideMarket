// import { useRouter } from 'expo-router';
// import React from 'react';
// import { View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Button } from '../../components/common/Button';
// import ListingGrid from '../../components/listings/ListingGrid';
// import { useAuth } from '../../contexts/AuthContext';
// import { useUserListings } from '../../hooks/useListings';
// import { listingsService } from '../../services/listings';
// import { globalStyles } from '../../styles/globalStyles';

// export default function MyListings() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const { listings, loading, refetch, refreshing, onRefresh } = useUserListings(user?.id);

//   const header = (
//     <View style={{ paddingHorizontal: 16, paddingTop: 16, marginBottom: 8 }}>
//       <Button title="Create new" onPress={() => router.push('/(tabs)/sell')} />
//     </View>
//   );

//   return (
//     <SafeAreaView style={globalStyles.safeContainer}>
//       <ListingGrid
//         items={listings}
//         loading={loading}
//         editable
//         header={header}
//         onDelete={async (id) => {
//           await listingsService.deleteListing(id);
//           await refetch();
//         }}
//         refreshing={refreshing}
//         onRefresh={onRefresh}
//       />
//     </SafeAreaView>
//   );
// }

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import ListingGrid from '../../components/listings/ListingGrid';
import { useAuth } from '../../contexts/AuthContext';
import { useUserListings } from '../../hooks/useListings';
import { listingsService } from '../../services/listings';
import { useRouter } from 'expo-router';
import { Button } from '../../components/common/Button';
import { globalStyles } from '../../styles/globalStyles';

export default function MyListings() {
  const { user } = useAuth();
  const router = useRouter();
  const { listings, loading, refetch } = useUserListings(user?.id);

  const onDelete = async (id: string) => {
    await listingsService.deleteListing(id);
    await refetch();
  };

  const header = (
    <View style={{ paddingVertical: 8 }}>
      <Button title="Create new" onPress={() => router.push('/(tabs)/sell')} />
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.safeContainer}>
      <ListingGrid
        items={listings}
        loading={loading}
        editable
        ownerId={user?.id}
        onDelete={onDelete}
        ListHeaderComponent={header}   // ✅ nút Create đứng trước grid
      />
    </SafeAreaView>
  );
}
