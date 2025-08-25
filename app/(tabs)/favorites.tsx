// app/(tabs)/favorites.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Image, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { purchasesService, type BuyerInfo } from '../../services/purchases';
import { Button } from '../../components/common/Button';
import { useRouter } from 'expo-router';

type CartRow = {
  listing_id: string;
  created_at: string;
  listing: { id: string; title: string; price: number; image_url: string | null } | null;
};

export default function FavoritesScreen() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [rows, setRows] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // modal form
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(profile?.display_name ?? '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  // đồng bộ tên khi profile thay đổi
  useEffect(() => { setName(profile?.display_name ?? ''); }, [profile?.display_name]);

  const count = useMemo(() => selected.size, [selected]);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        listing_id, created_at,
        listing:listing_id ( id, title, price, image_url )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) return Alert.alert('Error', error.message);
    setRows((data ?? []) as unknown as CartRow[]);
  };

  useEffect(() => { fetchFavorites(); }, [user?.id]);

  const toggleSelectMode = () => {
    setSelectMode((v) => !v);
    setSelected(new Set()); // reset selection
  };

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const onBuy = () => {
    if (!count) return;
    setOpen(true); // mở form xác nhận
  };

  const onSubmit = async () => {
    try {
      const ids = Array.from(selected);
      const info: BuyerInfo = { name, phone, address, note };
      await purchasesService.createMany(ids, info);
      setOpen(false);
      setSelected(new Set());
      setSelectMode(false);
      Alert.alert('Success', 'Purchased successfully');
      // router.push('/(tabs)/profile'); // nếu muốn
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not purchase');
    }
  };

  const renderItem = ({ item }: { item: CartRow }) => {
    const lid = item.listing?.id ?? item.listing_id;
    const isChecked = selected.has(lid);
    return (
      <Pressable
        onLongPress={() => setSelectMode(true)}
        onPress={() => (selectMode ? toggleSelected(lid) : router.push(`/listing/${lid}`))}
        style={{
          padding: 12,
          marginHorizontal: 16,
          marginBottom: 12,
          backgroundColor: '#fff',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isChecked ? '#2563eb' : '#e5e7eb',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {item.listing?.image_url ? (
          <Image
            source={{ uri: item.listing.image_url }}
            style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: '#eee' }}
          />
        ) : (
          <View style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: '#eee' }} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '600' }} numberOfLines={1}>
            {item.listing?.title ?? '(Deleted)'}
          </Text>
          <Text style={{ color: '#16a34a', marginTop: 2 }}>
            ${Number(item.listing?.price ?? 0).toFixed(0)}
          </Text>
        </View>

        {selectMode && (
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              borderWidth: 2,
              borderColor: isChecked ? '#2563eb' : '#94a3b8',
              backgroundColor: isChecked ? '#2563eb' : 'transparent',
            }}
          />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header trong trang để nút Select không bị overlay */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: '800' }}>Cart</Text>
        <Pressable onPress={toggleSelectMode}>
          <Text style={{ color: '#2563eb', fontWeight: '700' }}>
            {selectMode ? 'Cancel' : 'Select'}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(i) => i.listing?.id ?? i.listing_id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Thanh Buy cố định đáy */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: '#f8fafc' }}>
        <Button
          title={count ? `Buy (${count})` : 'Buy'}
          onPress={onBuy}
          disabled={!count}
          style={{ height: 52, borderRadius: 14 }}
        />
      </View>

      {/* Modal xác nhận thông tin người mua */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, gap: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 6 }}>Shipping info</Text>

            <Text style={{ fontWeight: '700' }}>Receiver name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 44, paddingHorizontal: 12 }}
            />

            <Text style={{ fontWeight: '700' }}>Phone number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              keyboardType="phone-pad"
              style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 44, paddingHorizontal: 12 }}
            />

            <Text style={{ fontWeight: '700' }}>Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Shipping address"
              style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, height: 44, paddingHorizontal: 12 }}
            />

            <Text style={{ fontWeight: '700' }}>Note (optional)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Note for seller/courier"
              style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, minHeight: 80, paddingHorizontal: 12, paddingTop: 10 }}
              multiline
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
              <Button title="Cancel" variant="outline" onPress={() => setOpen(false)} style={{ flex: 1 }} />
              <Button title="Confirm" onPress={onSubmit} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
