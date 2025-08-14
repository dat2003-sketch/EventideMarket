// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { View, Text, Image, Alert, ScrollView } from 'react-native';
// import { useLocalSearchParams, useRouter, Link } from 'expo-router';
// import { useListing } from '../../hooks/useListings';        // ✅ đường dẫn đúng
// import { formatPrice, formatCondition } from '../../utils/formatting';
// import { Button } from '../../components/common/Button';
// import { useAuth } from '../../contexts/AuthContext';
// import { useFavorites } from '../../hooks/useFavorites';
// import { listingsService } from '../../services/listings';
// import { globalStyles } from '../../styles/globalStyles';

// export default function ListingDetail() {
//   const params = useLocalSearchParams<{ id?: string | string[] }>();
//   const id = Array.isArray(params.id) ? params.id[0] : params.id;
//   const { listing, loading } = useListing(id);
//   const { user } = useAuth();
//   const { isFavorite, addFavorite, removeFavorite } = useFavorites();
//   const router = useRouter();

//   if (!id) return <SafeAreaView style={globalStyles.centeredContainer}><Text>Listing not found.</Text></SafeAreaView>;
//   if (loading || !listing) return <SafeAreaView style={globalStyles.centeredContainer}><Text>Loading...</Text></SafeAreaView>;

//   const mine = user?.id === listing.user_id;
//   const fav = isFavorite(listing.id);

//   const toggleFav = async () => { try { fav ? await removeFavorite(listing.id) : await addFavorite(listing.id); } catch {} };

//   const onDelete = () => {
//     Alert.alert('Delete', 'Are you sure?', [
//       { text: 'Cancel', style: 'cancel' },
//       { text: 'Delete', style: 'destructive', onPress: async () => { try { await listingsService.deleteListing(listing.id); router.back(); } catch (e:any) { Alert.alert('Error', e?.message || 'Failed'); } } },
//     ]);
//   };

//   return (
//     <SafeAreaView style={globalStyles.safeContainer}>
//       <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
//         {!!listing.image_url && <Image source={{ uri: listing.image_url }} style={{ width: '100%', height: 260, borderRadius: 12 }} />}
//         <Text style={globalStyles.title}>{listing.title}</Text>
//         <Text style={globalStyles.subtitle}>{formatPrice(listing.price)} · {formatCondition(listing.condition)}</Text>
//         <Text style={globalStyles.body}>{listing.description}</Text>
//         <View style={{ flexDirection: 'row', gap: 12 }}>
//           <Button title={fav ? 'Unfavorite' : 'Favorite'} onPress={toggleFav} variant={fav ? 'outline' : 'primary'} />
//           {mine ? (
//             <>
//               <Button title="Edit" onPress={() => router.push(`/listing/edit/${listing.id}`)} />
//               <Button title="Delete" onPress={onDelete} variant="danger" />
//             </>
//           ) : (
//             <Link href={`/user/${listing.user_id}`}>View seller profile</Link>
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }




import { profilesService } from '@/services/profiles';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../hooks/useFavorites';
import { useListing } from '../../hooks/useListings';
import { listingsService } from '../../services/listings';
import { globalStyles } from '../../styles/globalStyles';
import { formatCondition, formatPrice } from '../../utils/formatting';

export default function ListingDetail() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { listing, loading } = useListing(id);
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const router = useRouter();
  const [sellerName, setSellerName] = useState<string>('');

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!listing?.user_id) return;
      try {
        const p = await profilesService.getPublicProfile(listing.user_id);
        if (alive) setSellerName(p?.display_name || p?.email || 'Seller');
      } catch {
        /* ignore */
      }
    })();
    return () => { alive = false; };
  }, [listing?.user_id]);

  if (!id) {
    return (
      <SafeAreaView style={globalStyles.centeredContainer}>
        <Text>Listing not found.</Text>
      </SafeAreaView>
    );
  }
  if (loading || !listing) {
    return (
      <SafeAreaView style={globalStyles.centeredContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const mine = user?.id === listing.user_id;
  const fav = isFavorite(listing.id);

  const toggleFav = async () => {
    try {
      if (fav) await removeFavorite(listing.id);
      else await addFavorite(listing.id);
    } catch {}
  };

  const onDelete = () => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await listingsService.deleteListing(listing.id);
            router.back();
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Failed');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={globalStyles.safeContainer}>

      <View style={{  position: 'absolute' }}>
      <BackButton /> 
      <ScrollView contentContainerStyle={{ padding: 0, gap: 0 }}>
      </ScrollView>
    </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {!!listing.image_url && (
          <Image
            source={{ uri: listing.image_url }}
            style={{ width: '100%', height: 260, borderRadius: 12 }}
          />
        )}

        <Text style={globalStyles.title}>{listing.title}</Text>

        {/* Giá & condition khác màu */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
          <Text
            style={[globalStyles.subtitle, { fontSize: 26, color: '#16a34a', fontWeight: '700' }]} // xanh lá cho giá
          >
            {formatPrice(listing.price)}
          </Text>
          
          {/* <Text
            style={globalStyles.subtitle} // xám cho condition
          >
            ·
          </Text> */}
          
          <Text
            style={[globalStyles.subtitle, { 
              color: '#ef4444', 
              fontWeight: 'bold', 
              fontStyle: 'italic', 
              textDecorationLine: 'underline', 
              borderBottomWidth: 2,
              borderBottomColor: '#ef4444' 
            }]} // xám cho condition
          >
             {formatCondition(listing.condition)}
          </Text>
        </View>

        {/* Seller (có link tới trang hồ sơ) */}
        <Link href={`/user/${listing.user_id}`} asChild>
          <Text style={[globalStyles.caption, { textDecorationLine: 'underline' }]}>
            by {sellerName || '—'}
          </Text>
        </Link>

        <Text style={globalStyles.body}>{listing.description}</Text>

        {/* Actions */}
        <View style={{ gap: 12 }}>
          <Button
            title={fav ? 'Unfavorite' : 'Favorite'}
            onPress={toggleFav}
            variant={fav ? 'outline' : 'primary'}
            style={{ width: '100%' }}
          />

          {mine && (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                title="Edit"
                onPress={() => router.push(`/listing/edit/${listing.id}`)}
                variant="outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Delete"
                onPress={onDelete}
                variant="danger"
                style={{ flex: 1 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
