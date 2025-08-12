import React from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  onClear?: () => void;
  placeholder?: string;
}
export default function SearchBar({ value, onChangeText, onClear, placeholder }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>🔎</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search handmade items...'}
        style={styles.input}
        returnKeyType="search"
      />
      {!!value && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Text style={styles.clear}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  icon: { marginRight: 6, fontSize: 16, color: '#64748b' },
  input: { flex: 1, fontSize: 15 },
  clear: { marginLeft: 6, fontSize: 16, color: '#64748b' },
});
