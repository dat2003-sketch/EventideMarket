import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

function Gate() {
  const { user, loading } = useAuth();
  const segments = useSegments();        // ['(auth)','login'] | ['(tabs)','index']
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === '(auth)';

    if (!user && !inAuth) {
      // Chưa đăng nhập mà ở ngoài auth -> về login
      router.replace('/(auth)/login');
      return;
    }
    if (user && inAuth) {
      // Đã đăng nhập mà còn ở auth -> vào tab home (index của group tabs)
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Hợp lệ thì render route hiện tại
  return <Slot />;
}


export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Gate />
      </FavoritesProvider>
    </AuthProvider>
  );
}
