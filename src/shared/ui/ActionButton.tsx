import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
};

export function ActionButton({ title, onPress, disabled = false, secondary = false }: Props) {
  const [loading, setLoading] = React.useState(false);

  const handlePress = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      await onPress();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={() => void handlePress()}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? '#174D3E' : '#FFFFFF'} />
      ) : (
        <Text style={[styles.label, secondary && styles.secondaryLabel]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16805D',
  },
  secondary: { backgroundColor: '#E8F2EE', borderWidth: 1, borderColor: '#B8D5C9' },
  label: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secondaryLabel: { color: '#174D3E' },
  disabled: { opacity: 0.6 },
  pressed: { opacity: 0.8 },
});
