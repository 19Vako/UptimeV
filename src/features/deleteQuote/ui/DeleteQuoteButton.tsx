import React from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { deleteQuote } from '../model/deleteQuote';

type Props = {
  quoteId: string;
  onDeleted: () => void;
};

export function DeleteQuoteButton({ quoteId, onDeleted }: Props) {
  const confirmDelete = () => {
    Alert.alert('Delete quote?', 'This will also delete its line items.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void deleteQuote(quoteId)
            .then(onDeleted)
            .catch((error: unknown) => {
              Alert.alert(
                'Could not delete quote',
                error instanceof Error ? error.message : 'An unexpected database error occurred.',
              );
            });
        },
      },
    ]);
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={confirmDelete}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>Delete quote</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#B42318', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.65 },
});
