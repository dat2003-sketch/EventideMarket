import BackButton from '@/components/common/BackButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingForm from '../../../components/listings/ListingForm';
import { useListing } from '../../../hooks/useListings'; // ✅ đường dẫn đúng
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
      <View style={{  position: 'absolute' }}>
        <BackButton /> 
      </View>
      
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 52 }}>
        <ListingForm initialValues={listing} onSubmit={onSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}
