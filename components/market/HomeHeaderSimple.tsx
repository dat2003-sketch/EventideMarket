import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ConditionValue } from '../../utils/constants';

const ACCENT = '#6a7ab2ff';

interface Props {
  query: string;
  onChangeQuery: (t: string) => void;
  condition: ConditionValue | null;
  onSelectCondition: (c: ConditionValue | null) => void;
  sort: 'asc' | 'desc' | null;
  onToggleSort: () => void;
}

export default function HomeHeaderSimple({
  query, onChangeQuery, condition, onSelectCondition, sort, onToggleSort,
}: Props) {
  return (
    <View style={styles.wrap}>
      {/* Search */}
      <View style={styles.search}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          placeholder="Search products..."
          value={query}
          onChangeText={onChangeQuery}
          style={styles.input}
          returnKeyType="search"
        />
        {!!query && (
          <TouchableOpacity onPress={() => onChangeQuery('')} hitSlop={8}>
            <Ionicons name="close" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 2 }}
        style={{ marginTop: 12 }}
      >
        <Chip label="All" active={!condition} onPress={() => onSelectCondition(null)} />
        <Chip label="New" active={condition === 'new'} onPress={() => onSelectCondition('new')} />
        <Chip label="Like New" active={condition === 'like_new'} onPress={() => onSelectCondition('like_new')} />
        <Chip label="Good" active={condition === 'good'} onPress={() => onSelectCondition('good')} />
        <Chip
          label={sort === 'asc' ? 'Price ↑' : sort === 'desc' ? 'Price ↓' : 'Price ↑↓'}
          onPress={onToggleSort}
        />
      </ScrollView>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
      activeOpacity={0.85}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 30,
    paddingHorizontal: 12,
    height: 44,
  },
  input: { flex: 1, marginLeft: 8 },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipIdle: { backgroundColor: ACCENT, borderColor: ACCENT },
  chipActive: { backgroundColor: '#1E9E57', borderColor: '#1E9E57' },
  chipText: { color: '#fff', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
});
