import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const goAuth = () => router.push('/(auth)/login');
  const goProfile = () => router.push('/(tabs)/profile');

  const display = profile?.display_name || user?.email || 'Account';

  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => router.push('/(tabs)')} style={styles.brandWrap}>
        {/* Logo text — thay bằng Image nếu bạn có logo */}
        <Text style={styles.logoMark}>✓</Text>
        <Text style={styles.brand}>Eventide Market</Text>
      </Pressable>

      <View style={styles.actions}>
        {/* Browse / About bỏ qua theo yêu cầu */}

        {user ? (
          <Pressable onPress={goProfile} style={[styles.btn, styles.btnGhost]}>
            <Text style={[styles.btnText, styles.btnGhostText]} numberOfLines={1}>
              {display}
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={goAuth} style={[styles.btn, styles.btnPrimary]}>
            <Text style={styles.btnText}>Sign In</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  brandWrap: { flexDirection: 'row', alignItems: 'center' },
  logoMark: { fontSize: 18, color: '#2563eb', marginRight: 6 },
  brand: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: '#2563eb' },
  btnGhost: { backgroundColor: '#f1f5f9' },
  btnText: { color: '#fff', fontWeight: '600' },
  btnGhostText: { color: '#0f172a' },
});
