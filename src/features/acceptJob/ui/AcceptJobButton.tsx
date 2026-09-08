import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { acceptJob } from '../model/acceptJob';

type AcceptJobButtonProps = {
  postId: string;
};

const AcceptJobButton = ({ postId }: AcceptJobButtonProps) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAccept = async () => {
    setIsAccepting(true);
    setErrorMessage(null);

    try {
      await acceptJob(postId);
      setIsAccepted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to accept the job');
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isAccepting || isAccepted }}
        disabled={isAccepting || isAccepted}
        onPress={handleAccept}
        style={({ pressed }) => [
          styles.button,
          pressed && !isAccepting && !isAccepted && styles.pressed,
          (isAccepting || isAccepted) && styles.disabled,
        ]}
      >
        {isAccepting && <ActivityIndicator color="#fff" size="small" />}
        <Text style={styles.label}>
          {isAccepted ? 'Job accepted' : isAccepting ? 'Accepting...' : 'Accept job'}
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
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: '#93C5FD',
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

export default AcceptJobButton;
