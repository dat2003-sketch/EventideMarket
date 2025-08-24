
// import React, { useEffect, useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { View, Text, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
// import { useAuth } from '../../contexts/AuthContext';
// import { Button } from '../../components/common/Button';
// import { globalStyles } from '../../styles/globalStyles';
// import { purchasesService, type PurchaseRow } from '../../services/purchases';
// import { formatPrice } from '../../utils/formatting';

// export default function Profile() {
//   const { profile, updateProfile, signOut } = useAuth();
//   const [name, setName] = useState(profile?.display_name ?? '');
//   const [saving, setSaving] = useState(false);

//   // Purchases do TÔI đã mua (buyer)
//   const [orders, setOrders] = useState<PurchaseRow[]>([]);
//   const [loadingOrders, setLoadingOrders] = useState(true);

//   // Customer's orders: KHÁCH mua listing của TÔI (seller)
//   const [sales, setSales] = useState<PurchaseRow[]>([]);
//   const [loadingSales, setLoadingSales] = useState(true);

//   useEffect(() => {
//     let alive = true;

//     (async () => {
//       try {
//         setLoadingOrders(true);
//         const rows = await purchasesService.listMine();
//         if (alive) setOrders(rows);
//       } catch {
//         /* ignore */
//       } finally {
//         if (alive) setLoadingOrders(false);
//       }
//     })();

//     (async () => {
//       try {
//         setLoadingSales(true);
//         const rows = await purchasesService.listForSeller();
//         if (alive) setSales(rows);
//       } catch {
//         /* ignore */
//       } finally {
//         if (alive) setLoadingSales(false);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, []);

//   const save = async () => {
//     try {
//       setSaving(true);
//       await updateProfile({ display_name: name });
//       Alert.alert('Saved', 'Profile updated');
//     } catch (e: any) {
//       Alert.alert('Error', e?.message || 'Could not save');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <SafeAreaView style={globalStyles.safeContainer}>
//       <View style={{ padding: 16, gap: 12 }}>
//         <Text style={globalStyles.title}>Profile</Text>

//         <Text style={globalStyles.label}>Display name</Text>
//         <TextInput style={globalStyles.input} value={name} onChangeText={setName} />
//         <Button title={saving ? 'Saving...' : 'Save'} onPress={save} loading={saving} />
//         <Button title="Sign out" onPress={signOut} variant="outline" />

//         {/* My purchases (as buyer) */}
//         <Text style={[globalStyles.title, { fontSize: 16, marginTop: 16 }]}>My orders</Text>
//         {loadingOrders ? (
//           <ActivityIndicator />
//         ) : orders.length === 0 ? (
//           <Text style={{ color: '#64748b' }}>No orders yet</Text>
//         ) : (
//           orders.map((o) => (
//             <View
//               key={o.id}
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 gap: 12,
//                 paddingVertical: 10,
//                 borderBottomWidth: 1,
//                 borderBottomColor: '#e5e7eb',
//               }}
//             >
//               {o.listing?.image_url ? (
//                 <Image source={{ uri: o.listing.image_url }} style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: '#e5e7eb' }} />
//               ) : (
//                 <View style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: '#e5e7eb' }} />
//               )}

//               <View style={{ flex: 1 }}>
//                 <Text numberOfLines={1} style={{ fontWeight: '600' }}>
//                   {o.listing?.title ?? '(Deleted listing)'}
//                 </Text>
//                 <Text style={{ color: '#64748b', marginTop: 2 }}>
//                   {new Date(o.created_at).toLocaleString()}
//                 </Text>
//               </View>

//               <Text style={{ color: '#16a34a', fontWeight: '700' }}>{formatPrice(o.price)}</Text>
//             </View>
//           ))
//         )}

//         {/* Customer's orders (as seller) */}
//         <Text style={[globalStyles.title, { fontSize: 16, marginTop: 24 }]}>Customer's orders</Text>
//         {loadingSales ? (
//           <ActivityIndicator />
//         ) : sales.length === 0 ? (
//           <Text style={{ color: '#64748b' }}>No customer orders yet</Text>
//         ) : (
//           sales.map((o) => (
//             <View
//               key={o.id}
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 gap: 12,
//                 paddingVertical: 10,
//                 borderBottomWidth: 1,
//                 borderBottomColor: '#e5e7eb',
//               }}
//             >
//               {o.listing?.image_url ? (
//                 <Image source={{ uri: o.listing.image_url }} style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: '#e5e7eb' }} />
//               ) : (
//                 <View style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: '#e5e7eb' }} />
//               )}

//               <View style={{ flex: 1 }}>
//                 <Text numberOfLines={1} style={{ fontWeight: '600' }}>
//                   {o.listing?.title ?? '(Deleted listing)'}
//                 </Text>
//                 <Text style={{ color: '#64748b', marginTop: 2 }}>
//                   {new Date(o.created_at).toLocaleString()}
//                 </Text>
//               </View>

//               <Text style={{ color: '#16a34a', fontWeight: '700' }}>+{formatPrice(o.price)}</Text>
//             </View>
//           ))
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }


// app/(tabs)/profile.tsx
// app/(tabs)/profile.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, Image, Alert } from 'react-native';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { globalStyles } from '../../styles/globalStyles';
import { formatPrice } from '../../utils/formatting';
import {
  purchasesService,
  type PurchaseRow,
  type SaleRow,
} from '../../services/purchases';

export default function Profile() {
  const { profile, updateProfile, signOut } = useAuth();

  const [name, setName] = useState(profile?.display_name ?? '');
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState<PurchaseRow[]>([]);
  const [sales, setSales] = useState<SaleRow[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      await updateProfile({ display_name: name });
      Alert.alert('Saved', 'Profile updated');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingOrders(true);
        const rows = await purchasesService.listMine();
        if (alive) setOrders(rows);
      } finally {
        if (alive) setLoadingOrders(false);
      }
    })();

    (async () => {
      try {
        setLoadingSales(true);
        const rows = await purchasesService.listForSeller();
        if (alive) setSales(rows);
      } finally {
        if (alive) setLoadingSales(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Text style={{ fontWeight: '700', fontSize: 16, marginTop: 14 }}>{children}</Text>
  );

  const Row = ({ title, price, date, imageUrl, caption }: {
    title: string; price: number; date: string; imageUrl?: string | null; caption?: string;
  }) => (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 12,
      paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eef2f7'
    }}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: '#eef2f7' }} />
      ) : (
        <View style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: '#eef2f7' }} />
      )}
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={{ fontWeight: '600' }}>{title}</Text>
        {!!caption && <Text style={{ color: '#64748b', marginTop: 2 }}>{caption}</Text>}
        <Text style={{ color: '#94a3b8' }}>{new Date(date).toLocaleString()}</Text>
      </View>
      <Text style={{ color: '#16a34a', fontWeight: '700' }}>{formatPrice(price)}</Text>
    </View>
  );

  const noCustomerText = 'No customer orders yet — create a listing in Sell or wait for purchases.';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ fontWeight: '700', fontSize: 20 }}>Profile</Text>

        <Text style={{ fontWeight: '700', fontSize: 16 }}>Display name</Text>
        <TextInput
          style={{
            borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
            paddingHorizontal: 12, height: 44,
          }}
          value={name}
          onChangeText={setName}
        />

        <Button title={saving ? 'Saving...' : 'Save'} onPress={save} loading={saving} />
        <Button title="Sign out" onPress={signOut} variant="outline" />

        {/* My orders */}
        <SectionTitle>My orders</SectionTitle>
        {loadingOrders ? (
          <Text>Loading...</Text>
        ) : orders.length === 0 ? (
          <Text style={{ color: '#64748b' }}>No orders yet</Text>
        ) : (
          <View>
            {orders.map((o) => (
              <Row
                key={o.id}
                title={o.listing?.title || '(Deleted listing)'}
                price={o.price}
                date={o.created_at}
                imageUrl={o.listing?.image_url}
              />
            ))}
          </View>
        )}

        {/* Customer's orders */}
        <SectionTitle>Customer's orders</SectionTitle>
        {loadingSales ? (
          <Text>Loading...</Text>
        ) : sales.length === 0 ? (
          <Text style={{ color: '#64748b' }}>{noCustomerText}</Text>
        ) : (
          <View>
            {sales.map((s) => (
              <Row
                key={s.id}
                title={s.listing?.title || '(Deleted listing)'}
                price={s.price}
                date={s.created_at}
                imageUrl={s.listing?.image_url}
                caption={s.buyer_name ? `by ${s.buyer_name}` : undefined}
              />
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
