// import React, { useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { View, Text, TextInput, Alert } from 'react-native';
// import { useAuth } from '../../contexts/AuthContext';
// import { Button } from '../../components/common/Button';
// import { globalStyles } from '../../styles/globalStyles';

// export default function Profile() {
//   const { profile, updateProfile, signOut } = useAuth();
//   const [name, setName] = useState(profile?.display_name ?? '');
//   const [saving, setSaving] = useState(false);

//   const save = async () => {
//     try {
//       setSaving(true);
//       await updateProfile({ display_name: name });
//       Alert.alert('Saved', 'Profile updated');
//     } catch (e: any) {
//       Alert.alert('Error', e?.message || 'Could not save');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <SafeAreaView style={globalStyles.safeContainer}>
//       <View style={{ padding: 16, gap: 12 }}>
//         <Text style={globalStyles.title}>Profile</Text>
//         <Text style={globalStyles.label}>Display name</Text>
//         <TextInput style={globalStyles.input} value={name} onChangeText={setName} />
//         <Button title={saving ? 'Saving...' : 'Save'} onPress={save} loading={saving} />
//         <Button title='Sign out' onPress={signOut} variant='outline' />
//       </View>
//     </SafeAreaView>
//   );
// }

import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import ScreenHeader from '../../components/common/ScreenHeader';
import { useAuth } from '../../contexts/AuthContext';
import { GRADIENTS } from '../../utils/constants';

export default function Profile() {
  const { profile, updateProfile, signOut } = useAuth();
  const [name, setName] = useState(profile?.display_name ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      await updateProfile({ display_name: name });
      Alert.alert('Saved', 'Profile updated');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScreenHeader title="Profile" subtitle="Account & preferences" colors={GRADIENTS.profile} />
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>Display name</Text>
        <TextInput
          style={{
            borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
            paddingHorizontal: 12, height: 44,
          }}
          value={name}
          onChangeText={setName}
        />
        <Button title={saving ? 'Saving...' : 'Save'} onPress={save} loading={saving} />
        <Button title="Sign out" onPress={signOut} variant="outline" />
      </View>
    </SafeAreaView>
  );
}
