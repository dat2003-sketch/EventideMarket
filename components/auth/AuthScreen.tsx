import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

export default function AuthScreen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={globalStyles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        >
          <View style={{ maxWidth: 520, width: '100%', alignSelf: 'center', gap: 12 }}>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
