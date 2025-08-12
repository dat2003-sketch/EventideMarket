import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert } from 'react-native';
import ListingForm from '../../components/listings/ListingForm';
import { listingsService } from '../../services/listings';
import { useRouter } from 'expo-router';
import { globalStyles } from '../../styles/globalStyles';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';

export default function Sell() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // 👇 Redirect chỉ chạy sau render -> không còn warning ImperativeApiEmitter
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/login');
    }
  }, [loading, user, router]);

  // Trong lúc chờ xác định user, hoặc đang redirect -> đừng render UI
  if (loading || !user) return <Loading />;

  const handleSubmit = async (payload: any) => {
    try {
      await listingsService.createListing(payload); // user_id lấy từ session
      Alert.alert('Success', 'Listing created.');
      router.replace('/(tabs)/my-listings');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not create listing');
      throw e;
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeContainer}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ListingForm onSubmit={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}
