import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from 'react-native';
import { cancelJobProgress } from '../model/cancelJobProgress';
import { CancelJobProgressButtonProps } from '../type';

const CancelJobProgressButton = ({ postId, onCancelled }: CancelJobProgressButtonProps) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCancel = async () => {
    setIsCancelling(true);
    setErrorMessage(null);

    try {
      await cancelJobProgress(postId);
      setIsCancelled(true);
      onCancelled?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to cancel the job');
    } finally {
      setIsCancelling(false);
    }
  };

  const confirmCancel = () => {
    Alert.alert('Cancel job?', 'This will return the job to the open list.', [
      { text: 'Keep job', style: 'cancel' },
      { text: 'Cancel job', style: 'destructive', onPress: handleCancel },
    ]);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isCancelling || isCancelled }}
        disabled={isCancelling || isCancelled}
        onPress={confirmCancel}
        style={({ pressed }) => [
          styles.button,
          pressed && !isCancelling && !isCancelled && styles.pressed,
          (isCancelling || isCancelled) && styles.disabled,
        ]}
      >
        {isCancelling && <ActivityIndicator color="#fff" size="small" />}
        <Text style={styles.label}>
          {isCancelled ? 'Job cancelled' : isCancelling ? 'Cancelling...' : 'Cancel job'}
        </Text>
      </Pressable>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: '#D65A3A',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: '#F0A08D',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    marginTop: 8,
    color: '#B91C1C',
    fontSize: 14,
  },
});

export default CancelJobProgressButton;
