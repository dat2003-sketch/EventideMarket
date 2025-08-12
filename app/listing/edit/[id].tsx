import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ListingForm from '../../../components/listings/ListingForm';
import { useListing } from '../../../hooks/useListings';   // ✅ đường dẫn đúng
import { listingsService } from '../../../services/listings';
import { globalStyles } from '../../../styles/globalStyles';

export default function EditListing() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { listing, loading } = useListing(id);

  const onSubmit = async (payload: any) => {
    try {
      await listingsService.updateListing(id!, payload);
      Alert.alert('Saved', 'Listing updated');
      router.replace(`/listing/${id}`);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not update');
      throw e;
    }
  };

  if (loading || !listing) return null;

  return (
    <SafeAreaView style={globalStyles.safeContainer}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ListingForm initialValues={listing} onSubmit={onSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}
