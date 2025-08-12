
// import React from 'react';
// import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
// import { useRouter } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useAuth } from '../../contexts/AuthContext';
// import SearchBar from './SearchBar';
// import Chip from '../common/Chip';
// import {
//   CATEGORIES,
//   CONDITIONS,
//   Category,
//   ConditionValue,
// } from '../../utils/constants';

// interface Props {
//   query: string;
//   onChangeQuery: (q: string) => void;

//   category: Category | null;
//   onSelectCategory: (c: Category | null) => void;

//   condition: ConditionValue | null;
//   onSelectCondition: (c: ConditionValue | null) => void;

//   onClearAll?: () => void;
// }

// export default function MarketHeader({
//   query,
//   onChangeQuery,
//   category,
//   onSelectCategory,
//   condition,
//   onSelectCondition,
//   onClearAll,
// }: Props) {
//   const router = useRouter();
//   const { user, profile } = useAuth();
//   const display = profile?.display_name || user?.email || 'Account';

//   return (
//     <View style={{ backgroundColor: '#fff' }}>
//       {/* Brand row */}
//       <View style={styles.brandRow}>
//         <Pressable
//           onPress={() => router.push('/(tabs)')}
//           style={{ flexDirection: 'row', alignItems: 'center' }}
//         >
//           <Text style={styles.logo}>✓</Text>
//           <Text style={styles.brand}>Eventide Market</Text>
//         </Pressable>

//         {user ? (
//           <Pressable
//             onPress={() => router.push('/(tabs)/profile')}
//             style={[styles.btn, styles.btnGhost]}
//           >
//             <Text style={[styles.btnText, styles.btnGhostText]} numberOfLines={1}>
//               {display}
//             </Text>
//           </Pressable>
//         ) : (
//           <Pressable
//             onPress={() => router.push('/(auth)/login')}
//             style={[styles.btn, styles.btnPrimary]}
//           >
//             <Text style={styles.btnText}>Sign In</Text>
//           </Pressable>
//         )}
//       </View>

//       {/* Hero + filters */}
//       <LinearGradient
//         colors={['#eef2ff', '#faf5ff']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.hero}
//       >
//         <Text style={styles.title}>Discover Artisan Goods</Text>
//         <Text style={styles.subtitle}>
//           A curated collection of handmade items from talented creators around
//           the world.
//         </Text>

//         <View style={{ marginTop: 16 }}>
//           <SearchBar
//             value={query}
//             onChangeText={onChangeQuery}
//             onClear={() => onChangeQuery('')}
//             placeholder="Search handmade items..."
//           />
//         </View>

//         {/* Category chips */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingRight: 8, marginTop: 12 }}
//         >
//           <Chip
//             label="All categories"
//             selected={category === null}
//             onPress={() => onSelectCategory(null)}
//           />
//           {CATEGORIES.map((c) => (
//             <Chip
//               key={c}
//               label={c}
//               selected={category === c}
//               onPress={() => onSelectCategory(c)}
//             />
//           ))}
//         </ScrollView>

//         {/* Condition chips */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingRight: 8, marginTop: 8 }}
//         >
//           <Chip
//             label="Any condition"
//             selected={condition === null}
//             onPress={() => onSelectCondition(null)}
//           />
//           {CONDITIONS.map((c) => (
//             <Chip
//               key={c.value}
//               label={c.label}
//               selected={condition === c.value}
//               onPress={() => onSelectCondition(c.value)}
//             />
//           ))}
//         </ScrollView>

//         {!!(category || condition || query) && (
//           <Pressable onPress={onClearAll} style={{ alignSelf: 'flex-start', marginTop: 6 }}>
//             <Text style={{ color: '#2563eb', fontWeight: '600' }}>Clear filters</Text>
//           </Pressable>
//         )}
//       </LinearGradient>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   brandRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: '#e5e7eb',
//   },
//   logo: { fontSize: 18, color: '#2563eb', marginRight: 6 },
//   brand: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
//   btn: {
//     height: 40,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btnPrimary: { backgroundColor: '#2563eb' },
//   btnGhost: { backgroundColor: '#f1f5f9' },
//   btnText: { color: '#fff', fontWeight: '600' },
//   btnGhostText: { color: '#0f172a' },

//   hero: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 12 },
//   title: { fontSize: 26, fontWeight: '800', color: '#0f172a', textAlign: 'center' },
//   subtitle: { marginTop: 6, color: '#475569', textAlign: 'center' },
// });

import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from './SearchBar';
import Chip from '../common/Chip';
import {
  CATEGORIES, CONDITIONS,
  Category, ConditionValue, GRADIENTS,
} from '../../utils/constants';

interface Props {
  query: string;
  onChangeQuery: (q: string) => void;

  category: Category | null;
  onSelectCategory: (c: Category | null) => void;

  condition: ConditionValue | null;
  onSelectCondition: (c: ConditionValue | null) => void;

  onClearAll?: () => void;
}

export default function MarketHeader({
  query, onChangeQuery,
  category, onSelectCategory,
  condition, onSelectCondition,
  onClearAll,
}: Props) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const display = profile?.display_name || user?.email || 'Account';

  const [open, setOpen] = useState(false); // 👈 toggle panel

  const summary = useMemo(() => {
    const parts: string[] = [];
    if (category) parts.push(category);
    if (condition) {
      const c = CONDITIONS.find((x) => x.value === condition);
      if (c) parts.push(c.label);
    }
    if (query.trim()) parts.push(`“${query.trim()}”`);
    return parts.join(' • ') || 'All';
  }, [category, condition, query]);

  return (
    <View style={{ backgroundColor: '#fff' }}>
      {/* Brand row */}
      <View style={styles.brandRow}>
        <Pressable
          onPress={() => router.push('/(tabs)')}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text style={styles.logo}>✓</Text>
          <Text style={styles.brand}>Eventide Market</Text>
        </Pressable>

        {user ? (
          <Pressable onPress={() => router.push('/(tabs)/profile')} style={[styles.btn, styles.btnGhost]}>
            <Text style={[styles.btnText, styles.btnGhostText]} numberOfLines={1}>{display}</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => router.push('/(auth)/login')} style={[styles.btn, styles.btnPrimary]}>
            <Text style={styles.btnText}>Sign In</Text>
          </Pressable>
        )}
      </View>

      {/* Hero + search */}
      <LinearGradient colors={GRADIENTS.market} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
        <Text style={styles.title}>Discover Artisan Goods</Text>
        <Text style={styles.subtitle}>
          A curated collection of handmade items from talented creators around the world.
        </Text>

        <View style={{ marginTop: 16 }}>
          <SearchBar
            value={query}
            onChangeText={onChangeQuery}
            onClear={() => onChangeQuery('')}
            placeholder="Search handmade items..."
          />
        </View>

        {/* Filter summary row */}
        <View style={styles.summaryRow}>
          <Pressable onPress={() => setOpen((v) => !v)} style={[styles.filterBtn, open && styles.filterBtnActive]}>
            <Text style={[styles.filterBtnText, open && styles.filterBtnTextActive]}>
              {open ? 'Hide filters' : 'Filters'}
            </Text>
          </Pressable>

          <Text numberOfLines={1} style={styles.summaryText}>
            {summary}
          </Text>

          {(category || condition || query) ? (
            <Pressable onPress={onClearAll} hitSlop={8}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Collapsible panel */}
        {open && (
          <View style={styles.panel}>
            {/* Category chips */}
            <Text style={styles.groupLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8, marginBottom: 10 }}>
              <Chip label="All" selected={category === null} onPress={() => onSelectCategory(null)} />
              {CATEGORIES.map((c) => (
                <Chip key={c} label={c} selected={category === c} onPress={() => onSelectCategory(c)} />
              ))}
            </ScrollView>

            {/* Condition chips */}
            <Text style={styles.groupLabel}>Condition</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
              <Chip label="Any" selected={condition === null} onPress={() => onSelectCondition(null)} />
              {CONDITIONS.map((c) => (
                <Chip key={c.value} label={c.label} selected={condition === c.value} onPress={() => onSelectCondition(c.value)} />
              ))}
            </ScrollView>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e7eb',
  },
  logo: { fontSize: 18, color: '#2563eb', marginRight: 6 },
  brand: { fontSize: 18, fontWeight: '700', color: '#0f172a' },

  btn: { height: 40, paddingHorizontal: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: '#ffffff22', borderWidth: 1, borderColor: '#ffffff55' },
  btnGhost: { backgroundColor: '#f1f5f9' },
  btnText: { color: '#fff', fontWeight: '600' },
  btnGhostText: { color: '#0f172a' },

  hero: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center' },
  subtitle: { marginTop: 6, color: '#e5e7eb', textAlign: 'center' },

  summaryRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 12, height: 36, borderRadius: 999,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: '#1f2937' },
  filterBtnText: { color: '#0f172a', fontWeight: '700' },
  filterBtnTextActive: { color: '#fff' },
  summaryText: { flex: 1, color: '#f1f5f9' },
  clearText: { color: '#c7d2fe', fontWeight: '700' },

  panel: {
    marginTop: 12, backgroundColor: '#fff', borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: '#e5e7eb',
    // nhẹ nhàng: shadow
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  groupLabel: { marginBottom: 6, color: '#111827', fontWeight: '700' },
});
