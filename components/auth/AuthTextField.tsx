import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export default function AuthTextField({ label, error, style, ...rest }: Props) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={globalStyles.label}>{label}</Text>
      <TextInput
        style={[globalStyles.input, !!error && globalStyles.inputError, style]}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
      {!!error && <Text style={globalStyles.errorText}>{error}</Text>}
    </View>
  );
}
