// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import { formatPrice, truncate } from '../../utils/formatting';
// import { BORDER_RADIUS, SPACING, COLORS } from '../../utils/constants';

// interface Props {
//   item: any;
//   onPress: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   editable?: boolean;
// }

// export default function ListingCard({ item, onPress, onEdit, onDelete, editable }: Props) {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
//       {item.image_url ? (
//         <Image source={{ uri: item.image_url }} style={styles.img} />
//       ) : (
//         <View style={[styles.img, styles.placeholder]} />
//       )}
//       <View style={{ padding: 10 }}>
//         <Text numberOfLines={1} style={{ fontWeight: '600' }}>{truncate(item.title, 40)}</Text>
//         <Text style={{ color: COLORS.text.secondary }}>{formatPrice(item.price)}</Text>
//         {editable && (
//           <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
//             {!!onEdit && <Text onPress={onEdit} style={{ color: COLORS.primary }}>Edit</Text>}
//             {!!onDelete && <Text onPress={onDelete} style={{ color: COLORS.error }}>Delete</Text>}
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: BORDER_RADIUS.md,
//     overflow: 'hidden',
//     width: '48%'
//   },
//   img: { width: '100%', height: 130 },
//   placeholder: { backgroundColor: COLORS.background.tertiary },
// });

import React, { useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { formatPrice } from '../../utils/formatting';
import { useFavorites } from '../../hooks/useFavorites';
import { COLORS } from '../../utils/constants';

interface Props {
  item: any;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  editable?: boolean;
  showFavorite?: boolean; // mặc định true
}

export default function ListingCard({
  item,
  onPress,
  onEdit,
  onDelete,
  editable,
  showFavorite = true,
}: Props) {
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(item.id);

  const goDetail = () => (onPress ? onPress() : router.push(`/listing/${item.id}`) as any);
  const toggleFav = async () => {
    try {
      if (fav) await removeFavorite(item.id);
      else await addFavorite(item.id);
    } catch {}
  };

  const conditionLabel = useMemo(() => {
    const c = String(item.condition || '').toLowerCase();
    if (c === 'new') return 'New';
    if (c === 'used') return 'Used';
    return item.condition ?? '';
  }, [item.condition]);

  return (
    <Pressable onPress={goDetail} style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
      {/* Image */}
      <View style={styles.imageWrap}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}

        {/* Price pill */}
        <View style={styles.pricePill}>
          <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
        </View>

        {/* Condition badge */}
        {conditionLabel ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{conditionLabel}</Text>
          </View>
        ) : null}

        {/* Favorite heart */}
        {showFavorite ? (
          <Pressable onPress={toggleFav} hitSlop={10} style={styles.heart}>
            <Text style={[styles.heartText, fav && styles.heartTextActive]}>{fav ? '♥' : '♡'}</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Meta */}
      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
        {!!item.description && (
          <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
        )}

        {editable ? (
          <View style={styles.row}>
            {!!onEdit && (
              <Pressable onPress={onEdit} style={[styles.smallBtn, styles.btnOutline]}>
                <Text style={[styles.smallBtnText, styles.btnOutlineText]}>Edit</Text>
              </Pressable>
            )}
            {!!onDelete && (
              <Pressable onPress={onDelete} style={[styles.smallBtn, styles.btnDanger]}>
                <Text style={styles.smallBtnText}>Delete</Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const R = 16;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: R,
    backgroundColor: '#fff',
    overflow: 'hidden',
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', aspectRatio: 1, backgroundColor: '#f1f5f9' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  pricePill: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  priceText: { color: 'white', fontWeight: '700', fontSize: 12 },
  badge: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: '#111827', fontSize: 11, fontWeight: '600' },
  heart: { position: 'absolute', right: 10, top: 10 },
  heartText: { fontSize: 18, color: '#334155' },
  heartTextActive: { color: COLORS?.primary || '#2563eb' },

  meta: { padding: 10, gap: 6 },
  title: { fontWeight: '700', color: '#0f172a' },
  desc: { color: '#64748b', fontSize: 12, lineHeight: 16 },

  row: { flexDirection: 'row', gap: 8, marginTop: 4 },
  smallBtn: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  btnOutline: { borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: 'transparent' },
  btnOutlineText: { color: '#0f172a' },
  btnDanger: { backgroundColor: '#dc2626' },
});
