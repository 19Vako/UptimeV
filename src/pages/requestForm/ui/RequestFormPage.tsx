import { observeRequest } from '@/features/getRequests';
import type Request from '@/shared/db/model/request';
import { RequestFormWidget } from '@/widgets/requestForm';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { id?: string };

export function RequestFormPage({ id }: Props) {
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    let subscription: { unsubscribe: () => void } | undefined;

    void observeRequest(id)
      .then((observable) => {
        if (!active) return;
        subscription = observable.subscribe({
          next: (record) => {
            if (!active) return;
            setRequest(record);
            setLoading(false);
            setError(null);
          },
          error: (observationError: unknown) => {
            if (!active) return;
            setError(
              observationError instanceof Error
                ? observationError.message
                : 'Unable to load request.',
            );
            setLoading(false);
          },
        });
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load request.');
        setLoading(false);
      });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
        >
          <Text style={styles.close}>×</Text>
        </Pressable>
        <Text style={styles.heading}>{id ? 'Edit Request' : 'New Request'}</Text>
        <View style={styles.closePlaceholder} />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.state} color="#16805D" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : id && !request ? (
        <Text style={styles.error}>Request not found.</Text>
      ) : (
        <RequestFormWidget request={request ?? undefined} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F5' },
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E7E9',
  },
  close: { width: 30, color: '#48545A', fontSize: 30, lineHeight: 34 },
  heading: { color: '#17211F', fontWeight: '700', fontSize: 17 },
  closePlaceholder: { width: 30 },
  state: { flex: 1, marginTop: 32 },
  error: { padding: 24, color: '#B42318', textAlign: 'center' },
});
