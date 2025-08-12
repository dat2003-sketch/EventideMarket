import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScreenHeader({
  title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle?: string;
  colors: readonly [string, string];
}) {
  return (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.sub}>{subtitle}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  sub: { color: '#e5e7eb', marginTop: 4 },
});
