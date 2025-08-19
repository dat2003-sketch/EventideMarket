import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated, Easing, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SIZE = 120;

export default function EventideLogo() {
  // vòng quay & nghiêng nhẹ
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const tilt = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '6deg'] });

  // các hạt nền bay nhẹ
  const particles = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);
  const particleAnim = useRef(particles.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    particleAnim.forEach((v, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: 2500, delay: i * 300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    });
  }, [particleAnim]);

  return (
    <View style={{ alignItems: 'center' }}>
      {/* particles */}
      <View style={{ position: 'absolute', width: 260, height: 220 }}>
        {particles.map((_, i) => {
          const v = particleAnim[i];
          const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
          const opacity = v.interpolate({ inputRange: [0, 1], outputRange: [0.08, 0.25] });
          const size = 6 + (i % 3) * 4;
          const left = (i * 37) % 220;
          const top = (i * 53) % 180;
          return (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                left,
                top,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: '#9ee',
                opacity,
                transform: [{ translateY }],
              }}
            />
          );
        })}
      </View>

      {/* “khối” logo giả lập 3D bằng xoay & nghiêng */}
      <Animated.View
        style={{
          width: SIZE,
          height: SIZE,
          marginBottom: 24,
          borderRadius: 24,
          overflow: 'hidden',
          transform: [{ rotate: rotate }, { rotateX: tilt }],
          shadowColor: '#00f5ff',
          shadowOpacity: 0.25,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        }}
      >
        <LinearGradient
          colors={['#00f5ff', '#ff006e', '#8338ec']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
        {/* ô “market tile” */}
        <View
          style={{
            position: 'absolute',
            left: SIZE / 2 - 22,
            top: SIZE / 2 - 22,
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.9)',
          }}
        />
      </Animated.View>

      <Text style={{ fontSize: 28, fontWeight: '800', letterSpacing: 1, color: '#e8f7ff' }}>
        EventideMarket
      </Text>
      <Text style={{ marginTop: 6, color: '#c5e4ff', letterSpacing: 2, fontWeight: '500' }}>
        CREATIVE • QUALITY • INNOVATION
      </Text>
    </View>
  );
}
