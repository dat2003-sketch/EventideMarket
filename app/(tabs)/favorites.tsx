
// import React, { useEffect, useMemo, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import { supabase } from '../../services/supabase';
// import { purchasesService } from '../../services/purchases';
// import { Button } from '../../components/common/Button';

// type FavRow = {
//   listing_id: string;
//   listing: {
//     id: string;
//     title: string;
//     price: number;
//     image_url?: string | null;
//   } | null;
// };

// export default function Favorites() {
//   const router = useRouter();

//   const [rows, setRows] = useState<FavRow[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [selectMode, setSelectMode] = useState(false);
//   const [selected, setSelected] = useState<string[]>([]); // listing ids

//   const items = useMemo(
//     () => rows.map(r => r.listing).filter(Boolean) as NonNullable<FavRow['listing']>[],
//     [rows]
//   );

//   const fetchFavorites = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('favorites')
//       // alias listings -> listing (tránh type mismatch)
//       .select('listing_id, listing:listings ( id, title, price, image_url )')
//       .order('created_at', { ascending: false });

//     setLoading(false);
//     if (error) {
//       Alert.alert('Error', error.message);
//       return;
//     }

//     const normalized: FavRow[] = (data ?? []).map((r: any) => ({
//       listing_id: r.listing_id,
//       listing: Array.isArray(r.listing) ? (r.listing[0] ?? null) : (r.listing ?? null),
//     }));
//     setRows(normalized);
//   };

//   useEffect(() => { fetchFavorites(); }, []);

//   const toggleSelect = (id: string) => {
//     setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
//   };

//   const onPressItem = (id: string) => {
//     if (selectMode) toggleSelect(id);
//     else router.push(`/listing/${id}`);
//   };

//   const onBuySelected = async () => {
//     const picked = items.filter(it => selected.includes(it.id));
//     if (picked.length === 0) return;

//     try {
//       // Tạo nhiều đơn song song
//       await Promise.all(
//         picked.map((it) => purchasesService.create(it.id, Number(it.price ?? 0)))
//       );
//       Alert.alert('Success', 'Purchase created for selected items.');
//       setSelectMode(false);
//       setSelected([]);
//     } catch (e: any) {
//       Alert.alert('Error', e?.message || 'Could not create purchase');
//     }
//   };

//   const Header = () => (
//     <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//       <Text style={{ fontSize: 18, fontWeight: '700' }}>Favorites</Text>
//       <View style={{ flexDirection: 'row', gap: 8 }}>
//         {selectMode && (
//           <Button
//             title={`Buy selected (${selected.length})`}
//             onPress={onBuySelected}
//             disabled={selected.length === 0}
//             style={{ height: 40 }}
//           />
//         )}
//         <Button
//           title={selectMode ? 'Cancel' : 'Select'}
//           onPress={() => { setSelectMode(!selectMode); setSelected([]); }}
//           variant={selectMode ? 'outline' : 'primary'}
//           style={{ height: 40 }}
//         />
//       </View>
//     </View>
//   );

//   const renderItem = ({ item }: { item: NonNullable<FavRow['listing']> }) => {
//     const checked = selected.includes(item.id);

//     return (
//       <TouchableOpacity
//         activeOpacity={0.85}
//         onPress={() => onPressItem(item.id)}
//         onLongPress={() => setSelectMode(true)}
//         style={{
//           backgroundColor: '#fff',
//           borderRadius: 12,
//           margin: 8,
//           width: '45%',
//           elevation: 2,
//           shadowColor: '#000',
//           shadowOpacity: 0.08,
//           shadowRadius: 8,
//           shadowOffset: { width: 0, height: 3 },
//           overflow: 'hidden',
//         }}
//       >
//         {item.image_url ? (
//           <Image source={{ uri: item.image_url }} style={{ width: '100%', height: 110 }} resizeMode="cover" />
//         ) : (
//           <View style={{ width: '100%', height: 110, backgroundColor: '#e5e7eb' }} />
//         )}

//         {/* Checkbox overlay khi chọn */}
//         {selectMode && (
//           <View style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: checked ? '#2563eb' : '#fff', borderWidth: 2, borderColor: '#2563eb', alignItems: 'center', justifyContent: 'center' }}>
//             {checked ? <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff' }} /> : null}
//           </View>
//         )}

//         <View style={{ padding: 10 }}>
//           <Text numberOfLines={1} style={{ fontWeight: '600' }}>{item.title}</Text>
//           <Text style={{ color: '#16a34a', marginTop: 2 }}>${Number(item.price).toFixed(0)}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
//       <Header />
//       <FlatList
//         data={items}
//         keyExtractor={(it) => it.id}
//         renderItem={renderItem}
//         numColumns={2}
//         columnWrapperStyle={{ justifyContent: 'space-around' }}
//         contentContainerStyle={{ paddingBottom: 24 }}
//         ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40, color: '#64748b' }}>No favorites yet</Text>}
//       />
//     </View>
//   );
// }

// app/(tabs)/favorites.tsx
// app/(tabs)/favorites.tsx
// app/(tabs)/favorites.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { purchasesService } from '../../services/purchases';
import { supabase } from '../../services/supabase';
import { formatPrice } from '../../utils/formatting';

type FavRow = {
  listing_id: string;
  title: string;
  price: number;
  image_url: string | null;
};

export default function Favorites() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [rows, setRows] = useState<FavRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({}); // listing_id -> checked

  const items = rows; // đã map sẵn

  const fetchFavorites = async () => {
    if (!user) { setRows([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        listing_id,
        listing:listings!inner( id, title, price, image_url )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) { setRows([]); setLoading(false); return; }

    const mapped: FavRow[] = (data ?? []).map((r: any) => ({
      listing_id: r.listing?.id,
      title: r.listing?.title ?? '',
      price: Number(r.listing?.price ?? 0),
      image_url: r.listing?.image_url ?? null,
    }));

    setRows(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchFavorites(); }, [user?.id]);

  const toggleSelected = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected]
  );

  const onBuy = async () => {
    if (!selectedIds.length) {
      Alert.alert('Select items', 'Please choose products to buy.');
      return;
    }
    try {
      await purchasesService.createMany(selectedIds);
      Alert.alert('Success', `Bought ${selectedIds.length} item(s).`);
      setSelected({});
      setSelectMode(false);
      // (tùy chọn) reload profile hoặc purchases ở nơi khác
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to purchase');
    }
  };

  const renderItem = ({ item }: { item: FavRow }) => {
    const isChecked = !!selected[item.listing_id];
    return (
      <Pressable
        onLongPress={() => { if (!selectMode) setSelectMode(true); toggleSelected(item.listing_id); }}
        onPress={() => {
          if (selectMode) toggleSelected(item.listing_id);
          else router.push(`/listing/${item.listing_id}`);
        }}
        style={{
          width: '48%',
          borderRadius: 12,
          backgroundColor: '#fff',
          overflow: 'hidden',
          marginBottom: 12,
          borderWidth: 1,
          borderColor: isChecked ? '#2563eb' : '#e5e7eb',
        }}
      >
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={{ width: '100%', height: 120 }} />
        ) : <View style={{ width: '100%', height: 120, backgroundColor: '#eef2f7' }} />}
        <View style={{ padding: 10 }}>
          <Text numberOfLines={1} style={{ fontWeight: '600' }}>{item.title}</Text>
          <Text style={{ color: '#16a34a' }}>{formatPrice(item.price)}</Text>
        </View>
        {selectMode && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 2,
              borderColor: isChecked ? '#2563eb' : '#cbd5e1',
              backgroundColor: isChecked ? '#2563eb' : '#fff',
            }}
          />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Cart</Text>
        {selectMode ? (
          <Text onPress={() => { setSelectMode(false); setSelected({}); }} style={{ color: '#2563eb' }}>
            Cancel
          </Text>
        ) : (
          <Text onPress={() => setSelectMode(true)} style={{ color: '#2563eb' }}>
            Select
          </Text>
        )}
      </View>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        data={items}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={(it) => it.listing_id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={fetchFavorites}
      />

      {/* Bottom bar Buy */}
      {selectMode && (
        <View
          style={{
            position: 'absolute',
            left: 0, right: 0, bottom: 0,
            padding: 12, paddingBottom: 12 + insets.bottom,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}
        >
          <Pressable
            onPress={onBuy}
            style={{
              height: 48, borderRadius: 12, backgroundColor: '#2563eb',
              alignItems: 'center', justifyContent: 'center',
              opacity: selectedIds.length ? 1 : 0.5,
            }}
            disabled={!selectedIds.length}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>
              Buy ({selectedIds.length})
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
