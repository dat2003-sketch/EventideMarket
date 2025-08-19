import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventideLogo from '../../components/splash/EventideLogo';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/(auth)/login'), 1600);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0a0f1c', '#00131f']}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <EventideLogo />
      </LinearGradient>
    </SafeAreaView>
  );
}
