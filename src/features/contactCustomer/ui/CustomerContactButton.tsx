import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  phone?: string;
  label: string;
  action: (phone: string) => Promise<void>;
};

export function CustomerContactButton({ phone, label, action }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePress = async () => {
    if (!phone?.trim()) {
      setError('Customer phone is not provided');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await action(phone);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Unable to open app');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        disabled={!phone?.trim() || busy}
        onPress={() => void handlePress()}
        style={({ pressed }) => [
          styles.button,
          (!phone?.trim() || busy) && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        {busy ? <ActivityIndicator size="small" color="#176A51" /> : null}
        <Text style={styles.label}>{label}</Text>
      </Pressable>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : !phone?.trim() ? (
        <Text style={styles.error}>Add a customer phone to enable this action.</Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#E0F2EC',
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.75 },
  label: { color: '#176A51', fontWeight: '700', fontSize: 13 },
  error: { color: '#B42318', fontSize: 12, marginTop: 4 },
});
