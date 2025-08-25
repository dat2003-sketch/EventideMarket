// // utils/weather.ts
// export type NowWeather = {
//   tempC: number;
//   weatherCode: number;
//   updatedAt: Date;
// };

// export type GeoName = { name: string; admin1?: string | null; country?: string | null };

// export const HUE = {
//   latitude: 16.4637,
//   longitude: 107.5909,
//   label: 'Huế',
// };

// function pickNearestHourlyTemp(hourly: any): number | null {
//   try {
//     const times: string[] = hourly.time;
//     const temps: number[] = hourly.temperature_2m;
//     const nowIso = new Date().toISOString().slice(0, 13); // yyyy-mm-ddTHH
//     const idx = times.findIndex((t) => t.startsWith(nowIso));
//     if (idx >= 0 && temps[idx] != null) return temps[idx];
//   } catch {}
//   return null;
// }

// export async function fetchOpenMeteo(
//   latitude: number,
//   longitude: number
// ): Promise<NowWeather> {
//   const urlNew =
//     `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
//     `&current=temperature_2m,weather_code&hourly=temperature_2m&timezone=auto`;

//   const r = await fetch(urlNew);
//   const j = await r.json();

//   // API mới có key "current"
//   if (j?.current?.temperature_2m != null) {
//     return {
//       tempC: Number(j.current.temperature_2m),
//       weatherCode: Number(j.current.weather_code ?? 0),
//       updatedAt: new Date(),
//     };
//   }

//   // Fallback API cũ "current_weather"
//   if (j?.current_weather?.temperature != null) {
//     return {
//       tempC: Number(j.current_weather.temperature),
//       weatherCode: Number(j.current_weather.weathercode ?? 0),
//       updatedAt: new Date(),
//     };
//   }

//   // Fallback nữa: gần nhất theo hourly
//   const t = pickNearestHourlyTemp(j?.hourly);
//   if (t != null) {
//     return { tempC: Number(t), weatherCode: Number(j?.current?.weather_code ?? 0), updatedAt: new Date() };
//   }

//   throw new Error('Weather not available');
// }

// export async function reverseGeocodeOpenMeteo(
//   latitude: number,
//   longitude: number,
//   lang: string = 'en'
// ): Promise<GeoName | null> {
//   try {
//     const url =
//       `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}` +
//       `&language=${encodeURIComponent(lang)}&format=json`;
//     const r = await fetch(url);
//     const j = await r.json();
//     const g = j?.results?.[0];
//     if (!g) return null;
//     return { name: g.name, admin1: g.admin1 ?? null, country: g.country ?? null };
//   } catch {
//     return null;
//   }
// }

// // Rất gọn: map code → emoji
// export function weatherCodeToEmoji(code: number): string {
//   if ([0].includes(code)) return '☀️';
//   if ([1, 2, 3].includes(code)) return '⛅';
//   if ([45, 48].includes(code)) return '🌫️';
//   if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
//   if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
//   if ([95, 96, 99].includes(code)) return '⛈️';
//   return '🌡️';
// }

// utils/weather.ts
export type NowWeather = {
  tempC: number;
  weatherCode: number;
  updatedAt: Date;
};

export const HUE = {
  latitude: 16.4637,
  longitude: 107.5909,
  label: 'Huế',
};

/**
 * Gọi Open-Meteo theo chuẩn ổn định (current_weather=true).
 * Không phụ thuộc hourly hay schema mới.
 */
export async function fetchOpenMeteo(
  latitude: number,
  longitude: number
): Promise<NowWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current_weather=true&temperature_unit=celsius&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();

  const cw = j?.current_weather;
  if (!cw || cw.temperature == null) throw new Error('No current_weather');

  return {
    tempC: Number(cw.temperature),
    weatherCode: Number(cw.weathercode ?? 0),
    updatedAt: new Date(),
  };
}

/** Reverse geocoding đơn giản qua Open-Meteo (có thể fail thì trả Huế) */
export async function reverseGeocodeOpenMeteo(
  latitude: number,
  longitude: number,
  lang = 'vi'
): Promise<string> {
  try {
    const url =
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}` +
      `&language=${encodeURIComponent(lang)}&format=json`;
    const res = await fetch(url);
    const j = await res.json();
    const g = j?.results?.[0];
    if (g?.name) return g.name;
  } catch {}
  return 'Huế';
}

export function weatherCodeToEmoji(code: number): string {
  if (code === 0) return '☀️';
  if ([1, 2, 3].includes(code)) return '⛅';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '🌡️';
}
