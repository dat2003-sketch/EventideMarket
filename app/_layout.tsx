


// import React, { useEffect } from 'react';
// import { Slot, useRouter, useSegments } from 'expo-router';
// import { ActivityIndicator, View } from 'react-native';
// import { AuthProvider, useAuth } from '../contexts/AuthContext';
// import { FavoritesProvider } from '../contexts/FavoritesContext';

// function Gate() {
//   const { user, loading } = useAuth();
//   const segments = useSegments();        // ['(auth)','login'] | ['(tabs)','index']
//   const router = useRouter();

//   useEffect(() => {
//     if (loading) return;

//     const inAuth = segments[0] === '(auth)';

//     if (!user && !inAuth) {
//       // Chưa đăng nhập mà ở ngoài auth -> về login
//       router.replace('/(auth)/login');
//       return;
//     }
//     if (user && inAuth) {
//       // Đã đăng nhập mà còn ở auth -> vào tab home (index của group tabs)
//       router.replace('/(tabs)');
//     }
//   }, [user, loading, segments]);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   // Hợp lệ thì render route hiện tại
//   return <Slot />;
// }


// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <FavoritesProvider>
//         <Gate />
//       </FavoritesProvider>
//     </AuthProvider>
//   );
// }

import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

function Gate() {
  const { user, loading } = useAuth();
  const segments = useSegments(); // ['(auth)','login'] | ['(tabs)','index']
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuth = segments[0] === '(auth)';

    // ❗ Chưa đăng nhập: nếu đang ở ngoài (auth) thì ép về splash (logo trước login)
    if (!user) {
      if (!inAuth) router.replace('/(auth)/splash');
      return;
    }

    // ✅ ĐÃ đăng nhập mà còn ở (auth) -> đưa ra group tabs (market)
    if (inAuth) {
      router.replace('/(tabs)');
      return;
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Gate />
      </FavoritesProvider>
    </AuthProvider>
  );
}
