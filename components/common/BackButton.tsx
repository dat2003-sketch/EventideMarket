import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BackButton({ color = '#111' }: { color?: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => router.back()}
      style={[styles.btn, { top: insets.top + 8 }]}
      hitSlop={10}
    >
      <Ionicons name="chevron-back" size={22} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    // shadow
    shadowColor: '#f1e9e9ff',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    zIndex: 10,
  },
});
