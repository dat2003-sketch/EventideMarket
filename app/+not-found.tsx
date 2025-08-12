import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text>Not Found</Text>
    </View>
  );
}