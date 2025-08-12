import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/constants';

interface CardProps { children: React.ReactNode; style?: ViewStyle; padding?: boolean; shadow?: boolean; }

export const Card: React.FC<CardProps> = ({ children, style, padding = true, shadow = true }) => {
  const cardStyle = [styles.base, shadow && styles.shadow, padding && styles.padding, style];
  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: { backgroundColor: COLORS.background.primary, borderRadius: BORDER_RADIUS.md },
  padding: { padding: SPACING.md },
  shadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});