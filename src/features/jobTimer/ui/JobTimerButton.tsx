import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useJobTimer } from '../model/useJobTimer';

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
};

export function JobTimerButton({ jobId }: { jobId: string }) {
  const { elapsedSeconds, isRunning, loading, busy, error, start, pause, reset } =
    useJobTimer(jobId);

  const confirmReset = () => {
    Alert.alert('Reset timer?', 'This will remove all logged time for this job.', [
      { text: 'Keep time', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => void reset().catch(() => undefined),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{loading ? 'Loading timer…' : formatDuration(elapsedSeconds)}</Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={loading || busy}
          onPress={() => void (isRunning ? pause() : start()).catch(() => undefined)}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <Text style={styles.primaryText}>
            {busy ? 'Saving…' : isRunning ? 'Pause' : 'Start timer'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={loading || busy || elapsedSeconds === 0}
          onPress={confirmReset}
          style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
        >
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, alignItems: 'flex-start' },
  time: { color: '#17211F', fontSize: 20, fontWeight: '800', fontVariant: ['tabular-nums'] },
  actions: { flexDirection: 'row', gap: 8 },
  primaryButton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#16805D',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  resetButton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#E9F0ED',
  },
  resetText: { color: '#34413D', fontWeight: '700' },
  pressed: { opacity: 0.8 },
  error: { color: '#B42318', fontSize: 13 },
});
