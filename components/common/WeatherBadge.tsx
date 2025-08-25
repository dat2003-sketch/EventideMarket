// components/common/WeatherBadge.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import * as Location from 'expo-location';
import {
  fetchOpenMeteo,
  reverseGeocodeOpenMeteo,
  weatherCodeToEmoji,
  HUE,
  type NowWeather,
} from '../../utils/weather';

type Props = { style?: any };

/**
 * ĐẶT 25 để ép hiển thị 25°C.
 * Muốn quay lại dùng API: đổi thành null.
 * Đổi FORCE_TEMP = null → dùng dữ liệu thật từ API (khi bạn muốn bật lại sau này).
 */
const FORCE_TEMP: number | null = 25;

export default function WeatherBadge({ style }: Props) {
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<string>(HUE.label);
  const [data, setData] = useState<NowWeather | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (tryGps: boolean) => {
    setLoading(true);
    setError(null);
    try {
      let lat = HUE.latitude;
      let lon = HUE.longitude;
      let label = HUE.label;

      if (tryGps) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Lowest,
          });
          lat = loc.coords.latitude;
          lon = loc.coords.longitude;
          label = await reverseGeocodeOpenMeteo(lat, lon, 'vi');
        } else {
          setError('Location permission denied');
        }
      }

      setCity(label);

      // Nếu bạn đang ép nhiệt độ, không cần gọi API (nhưng vẫn có thể gọi để lấy icon/emoji)
      if (FORCE_TEMP != null) {
        setData({
          tempC: FORCE_TEMP,
          weatherCode: 0, // nắng (tùy chỉnh nếu muốn)
          updatedAt: new Date(),
        });
      } else {
        const w = await fetchOpenMeteo(lat, lon);
        setData(w);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed');
      // fallback: vẫn set temp theo FORCE_TEMP nếu có, còn không thì null
      if (FORCE_TEMP != null) {
        setData({
          tempC: FORCE_TEMP,
          weatherCode: 0,
          updatedAt: new Date(),
        });
      } else {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Lần đầu chỉ dùng mặc định Huế (và/hoặc FORCE_TEMP)
    load(false);
  }, []);

  const emoji = weatherCodeToEmoji(data?.weatherCode ?? 0);
  const tempStr =
    FORCE_TEMP != null
      ? `${FORCE_TEMP} °C`
      : data
      ? `${Math.round(data.tempC)} °C`
      : '– °C';

  return (
    <View
      style={[
        {
          backgroundColor: '#628AFB',
          borderRadius: 16,
          padding: 16,
          marginHorizontal: 16,
          marginBottom: 10,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: 'white', opacity: 0.9 }}>
          {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </Text>
        <Pressable onPress={() => load(true)}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Refresh</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
          {city} <Text>📍</Text>
        </Text>
      </View>

      <View style={{ marginTop: 8, minHeight: 28 }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '800' }}>{tempStr}</Text>
        )}
      </View>

      {!!error && (
        <Text style={{ color: 'white', opacity: 0.9, marginTop: 6 }}>
          {error}. {FORCE_TEMP != null ? 'Forced 25°C.' : 'Using default location.'}
        </Text>
      )}
    </View>
  );
}
