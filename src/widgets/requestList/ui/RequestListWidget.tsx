import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { observeRequests } from '@/features/getRequests';
import { REQUEST_STATUSES, type RequestStatus } from '@/entities/request';
import type Request from '@/shared/db/model/request';
import { ActionButton } from '@/shared/ui';

const statusLabels: Record<RequestStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

function formatDate(value: Date) {
  return value.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function RequestListWidget() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = observeRequests().subscribe({
      next: (records) => {
        setRequests(records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
        setLoading(false);
        setError(null);
      },
      error: (observationError: unknown) => {
        setError(
          observationError instanceof Error ? observationError.message : 'Unable to load requests.',
        );
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} color="#16805D" />;
  if (error) return <Text style={styles.stateText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={requests.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptyDescription}>
              Create a request to record service details and availability.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: '/(job)/request-detail', params: { id: item.id } })
            }
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </View>
            <Text style={styles.details} numberOfLines={2}>
              {item.serviceDetails}
            </Text>
            <View style={styles.meta}>
              <Text style={styles.status}>{statusLabels[item.status] ?? REQUEST_STATUSES.NEW}</Text>
              <Text style={styles.date}>{formatDate(item.preferredVisitDate)}</Text>
            </View>
          </Pressable>
        )}
      />
      <View style={styles.createButton}>
        <ActionButton title="New Request" onPress={() => router.push('/(job)/request-create')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F5' },
  list: { padding: 16, gap: 12, paddingBottom: 8 },
  emptyList: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  empty: { alignItems: 'center', gap: 8 },
  emptyTitle: { color: '#17211F', fontSize: 18, fontWeight: '700' },
  emptyDescription: { color: '#77818A', textAlign: 'center', lineHeight: 20 },
  card: { padding: 16, borderRadius: 14, backgroundColor: '#FFFFFF', gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, color: '#17211F', fontSize: 16, fontWeight: '700' },
  chevron: { color: '#8DBA19', fontSize: 24 },
  details: { color: '#667085', fontSize: 14, lineHeight: 20 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  status: {
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#E8F2EE',
    color: '#176A51',
    fontSize: 12,
    fontWeight: '700',
  },
  date: { color: '#77818A', fontSize: 12 },
  createButton: { padding: 16, backgroundColor: '#FFFFFF' },
  center: { flex: 1, marginTop: 32 },
  stateText: { flex: 1, padding: 24, textAlign: 'center', color: '#B42318' },
  pressed: { opacity: 0.75 },
});
