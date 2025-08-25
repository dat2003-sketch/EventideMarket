// services/weather.ts
import * as Location from 'expo-location';

export type NowWeather = {
  tempC: number;
  weatherCode: number;
  emoji: string;
  city?: string;
  updatedAt: Date;
};

export async function getCoords(): Promise<{ latitude: number; longitude: number } | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  const loc = await Location.getCurrentPositionAsync({});
  return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
}

export async function fetchOpenMeteo(lat: number, lon: number): Promise<{ tempC: number; code: number }> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current_weather=true&timezone=auto`;
  const res = await fetch(url);
  const json = await res.json();
  return {
    tempC: Number(json?.current_weather?.temperature ?? 0),
    code: Number(json?.current_weather?.weathercode ?? 0),
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ city?: string }> {
  // Open-Meteo geocoding
  const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en`;
  const res = await fetch(url);
  const json = await res.json();
  const first = (json?.results ?? [])[0];

  // các field trong API có thể là string | null → normalize về string | undefined
  const city: string | undefined =
    first?.city ?? first?.name ?? first?.admin1 ?? first?.admin2 ?? undefined;

  return { city };
}

export function weatherCodeToEmoji(code: number): string {
  // rút gọn: chỉ cần nhìn “tâm trạng” của trời
  if ([0].includes(code)) return '☀️';
  if ([1, 2].includes(code)) return '🌤️';
  if ([3].includes(code)) return '☁️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '🌡️';
}

export async function getNowWeather(): Promise<NowWeather | null> {
  const coords = await getCoords();
  if (!coords) return null;

  const [wx, geo] = await Promise.all([
    fetchOpenMeteo(coords.latitude, coords.longitude),
    reverseGeocode(coords.latitude, coords.longitude),
  ]);

  return {
    tempC: wx.tempC,
    weatherCode: wx.code,
    emoji: weatherCodeToEmoji(wx.code),
    city: geo.city,
    updatedAt: new Date(),
  };
}
