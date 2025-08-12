import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { profilesService } from '../../services/profiles';
import { useEffect, useState } from 'react';
import { useUserListings } from '../../hooks/useListings';
import ListingGrid from '../../components/listings/ListingGrid';
import { globalStyles } from '../../styles/globalStyles';

export default function PublicProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const { listings, loading } = useUserListings(id);

  useEffect(() => { (async () => setProfile(await profilesService.getPublicProfile(id!)))(); }, [id]);

  return (
    <SafeAreaView style={globalStyles.safeContainer}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {profile && (
          <View>
            <Text style={globalStyles.title}>{profile.display_name}</Text>
            <Text style={globalStyles.caption}>{profile.listing_count} active listings</Text>
          </View>
        )}
        <ListingGrid items={listings} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}