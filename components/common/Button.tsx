import React from 'react';
import { Text, Pressable, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

type Variant = 'primary' | 'outline' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
}

export const Button: React.FC<Props> = ({ title, onPress, loading, disabled, variant = 'primary', style }) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? <ActivityIndicator /> : (
        <Text style={[styles.text, (variant === 'outline') && styles.textOutline]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    width: '100%',                // ✅ đảm bảo nút full width
  },
  primary: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  outline: { backgroundColor: 'transparent', borderColor: '#cbd5e1' },
  danger: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.85 },
  text: { color: 'white', fontWeight: '600' },
  textOutline: { color: '#0f172a' },
});
