import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingGrid from '../../components/listings/ListingGrid';
import { useUserListings } from '../../hooks/useListings';
import { profilesService } from '../../services/profiles';
import { globalStyles } from '../../styles/globalStyles';

export default function PublicProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const { listings, loading } = useUserListings(id);

  useEffect(() => { (async () => setProfile(await profilesService.getPublicProfile(id!)))(); }, [id]);

  return (
    <SafeAreaView style={globalStyles.safeContainer}>
      <View style={{ padding: 16, gap: 12 }}>
        {profile && (
          <View>
            <Text style={globalStyles.title}>{profile.display_name}</Text>
            <Text style={globalStyles.caption}>{profile.listing_count} active listings</Text>
          </View>
        )}
        <ListingGrid items={listings} loading={loading} />
      </View>
    </SafeAreaView>
  );
}