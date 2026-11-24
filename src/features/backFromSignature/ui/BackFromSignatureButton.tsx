import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export function BackFromSignatureButton({ disabled = false }: { disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back without saving the signature"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/(job)/(tabs)/home'))}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.label}>‹ Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  label: { color: '#48545A', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.65 },
});
