

// import React, { useEffect } from 'react';
// import { View, Text, StatusBar, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';

// // Splash tối giản, nền sáng đồng bộ tone app (#2563eb)
// export default function Splash() {
//   const router = useRouter();

//   useEffect(() => {
//     const t = setTimeout(() => router.replace('/(auth)/login'), 1200);
//     return () => clearTimeout(t);
//   }, [router]);

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar barStyle="dark-content" />
//       <LinearGradient
//         colors={['#EAF2FF', '#F7FBFF']} // nền sáng xanh nhạt
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={StyleSheet.absoluteFillObject}
//       />

//       <View style={styles.center}>
//         {/* Biểu tượng brand: khối nghiêng màu #2563eb + ô vuông trắng ở giữa */}
//         <View style={styles.logo}>
//           <View style={styles.logoInner} />
//         </View>

//         <Text style={styles.brand}>EventideMarket</Text>
//         <Text style={styles.tagline}>CREATIVE • QUALITY • INNOVATION</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   logo: {
//     width: 120, height: 120, borderRadius: 28,
//     backgroundColor: '#2563eb',
//     transform: [{ rotate: '-18deg' }],
//     shadowColor: '#2563eb', shadowOpacity: 0.35, shadowRadius: 24,
//     shadowOffset: { width: 0, height: 12 }, elevation: 16,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   logoInner: {
//     width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff',
//     transform: [{ rotate: '18deg' }],
//     shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
//   },
//   brand: { marginTop: 28, fontSize: 22, fontWeight: '800', color: '#0f172a' },
//   tagline: { marginTop: 6, letterSpacing: 2, color: '#64748b' },
// });

// app/(auth)/splash.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StatusBar, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function Splash() {
  const router = useRouter();

  // Animated values
  const rot = useRef(new Animated.Value(0)).current;     // wobble
  const floatY = useRef(new Animated.Value(0)).current;  // bobbing
  const pulse = useRef(new Animated.Value(0)).current;   // inner square pulse
  const textFade = useRef(new Animated.Value(0)).current;
  const textUp = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    // Start loops
    Animated.loop(
      Animated.sequence([
        Animated.timing(rot,   { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(rot,   { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();

    // Title fade-in
    Animated.parallel([
      Animated.timing(textFade, { toValue: 1, duration: 700, delay: 250, useNativeDriver: true }),
      Animated.timing(textUp,   { toValue: 0, duration: 700, delay: 250, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    // Navigate after 1.2s (như bạn yêu cầu)
    const t = setTimeout(() => router.replace('/(auth)/login'), 1200);
    return () => clearTimeout(t);
  }, [router, rot, floatY, pulse, textFade, textUp]);

  // Interpolations
  const rotateZ = rot.interpolate({ inputRange: [0, 1], outputRange: ['-22deg', '-14deg'] });
  const translateY = floatY.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const innerScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.35] });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#EAF2FF', '#F7FBFF']} // đồng bộ tone sáng của app
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* vài “bubble” nhẹ nhàng */}
      <View pointerEvents="none" style={styles.bubblesLayer}>
        <Animated.View style={[styles.bubble, { left: 80, top: 180, opacity: glowOpacity, transform: [{ translateY }] }]} />
        <Animated.View style={[styles.bubble, { left: 260, top: 260, opacity: glowOpacity, transform: [{ translateY }] }]} />
        <Animated.View style={[styles.bubble, { left: 140, top: 340, opacity: glowOpacity, transform: [{ translateY }] }]} />
      </View>

      <View style={styles.center}>
        {/* Logo block */}
        <Animated.View style={[
          styles.logo,
          {
            transform: [{ rotateZ }, { translateY }],
          },
        ]}>
          {/* Glow ring */}
          <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
          {/* Inner white square */}
          <Animated.View style={[styles.logoInner, { transform: [{ rotate: '18deg' }, { scale: innerScale }] }]} />
        </Animated.View>

        {/* Brand text */}
        <Animated.Text style={[styles.brand, { opacity: textFade, transform: [{ translateY: textUp }] }]}>
          EventideMarket
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: textFade, transform: [{ translateY: textUp }] }]}>
          CREATIVE • QUALITY • INNOVATION
        </Animated.Text>
      </View>
    </View>
  );
}

const PRIMARY = '#2563eb';

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 120, height: 120, borderRadius: 28,
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY, shadowOpacity: 0.35, shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 }, elevation: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: PRIMARY, opacity: 0.2,
    filter: undefined, // RN keeps this harmless; left for web parity
  },
  logoInner: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  brand: { marginTop: 28, fontSize: 22, fontWeight: '800', color: '#0f172a' },
  tagline: { marginTop: 6, letterSpacing: 2, color: '#64748b' },

  bubblesLayer: { ...StyleSheet.absoluteFillObject },
  bubble: {
    position: 'absolute',
    width: 14, height: 14, borderRadius: 7, backgroundColor: PRIMARY,
  },
});
