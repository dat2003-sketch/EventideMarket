import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';

export default function Loading() {
  return (
    <View style={globalStyles.centeredContainer}>
      <ActivityIndicator />
    </View>
  );
}