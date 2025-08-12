import React from 'react';
import { Text } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
export default function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={globalStyles.errorText}>{message}</Text>;
}