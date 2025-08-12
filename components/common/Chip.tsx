import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}
export default function Chip({ label, selected, onPress, style }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        selected ? styles.sel : styles.unsel,
        style,
      ]}
    >
      <Text style={[styles.text, selected && styles.textSel]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  unsel: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' },
  sel: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  text: { color: '#0f172a', fontWeight: '600' },
  textSel: { color: 'white' },
});
