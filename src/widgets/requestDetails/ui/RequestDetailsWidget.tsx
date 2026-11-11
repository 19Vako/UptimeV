import { REQUEST_STATUSES, type RequestStatus } from '@/entities/request';
import { deleteRequest } from '@/features/deleteRequest';
import { observeRequest } from '@/features/getRequests';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { ActionButton } from '@/shared/ui';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = { id: string };
type DetailTab = 'request' | 'notes';

const statusLabels: Record<RequestStatus, string> = {
  new: 'New',
  in_progress: 'In progress',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

function formatDate(value?: Date) {
  return (
    value?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) ??
    'Not set'
  );
}

export function RequestDetailsWidget({ id }: Props) {
  const [request, setRequest] = useState<Request | null>(null);
  const [clientJob, setClientJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<DetailTab>('request');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    let requestSubscription: { unsubscribe: () => void } | undefined;
    const load = async () => {
      try {
        const [requestObservable, jobs] = await Promise.all([
          observeRequest(id),
          database.get<JobPost>(TableNames.JOBPOSTS).query().fetch(),
        ]);
        if (!active) return;
        const subscription = requestObservable.subscribe({
          next: (record) => {
            if (!active) return;
            setRequest(record);
            setClientJob(
              record.customerId
                ? (jobs.find((job) => job.customerId === record.customerId) ?? null)
                : null,
            );
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
        requestSubscription = subscription;
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load request.');
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      active = false;
      requestSubscription?.unsubscribe();
    };
  }, [id]);

  const confirmDelete = () => {
    Alert.alert('Delete request?', 'This request will be permanently removed from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setDeleting(true);
          void deleteRequest(id)
            .then(() => router.replace('/(job)/(tabs)/requests'))
            .catch((deleteError: unknown) => {
              Alert.alert(
                'Could not delete request',
                deleteError instanceof Error
                  ? deleteError.message
                  : 'An unexpected error occurred.',
              );
            })
            .finally(() => setDeleting(false));
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={styles.center} color="#16805D" />;
  if (error || !request) return <Text style={styles.error}>{error ?? 'Request not found.'}</Text>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>▣</Text>
        </View>
        <Text style={styles.statusLabel}>
          {statusLabels[request.status] ?? REQUEST_STATUSES.NEW}
        </Text>
        <Text style={styles.title}>Request for {clientJob?.customer || 'Client'}</Text>
        {clientJob ? <Text style={styles.clientName}>{clientJob.customer}</Text> : null}
        {clientJob?.location ? <Text style={styles.address}>{clientJob.location}</Text> : null}
        <View style={styles.schedule}>
          <Text style={styles.scheduleTitle}>Preferred assessment date</Text>
          <Text style={styles.scheduleValue}>
            {formatDate(request.preferredVisitDate)} · {request.preferredTimeOfDay}
          </Text>
          {request.backupVisitDate ? (
            <Text style={styles.scheduleSecondary}>
              Alternate: {formatDate(request.backupVisitDate)}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.actionNotice}>
        <Text style={styles.noticeText}>
          Assessment completion and Quote conversion are not available for Requests yet.
        </Text>
      </View>

      <View style={styles.actionRow}>
        <View style={styles.actionButton}>
          <ActionButton
            title="Edit Request"
            onPress={() => router.push({ pathname: '/(job)/request-edit', params: { id } })}
          />
        </View>
        <View style={styles.actionButton}>
          <ActionButton
            title={deleting ? 'Deleting…' : 'Delete'}
            secondary
            disabled={deleting}
            onPress={confirmDelete}
          />
        </View>
      </View>

      <View style={styles.tabs}>
        {(['request', 'notes'] as const).map((value) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === value }}
            key={value}
            onPress={() => setTab(value)}
            style={[styles.tab, tab === value && styles.activeTab]}
          >
            <Text style={[styles.tabText, tab === value && styles.activeTabText]}>
              {value === 'request' ? 'Request' : 'Notes'}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === 'request' ? (
        <>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionHeadingText}>Instructions</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Request title</Text>
            <Text style={styles.value}>{request.title}</Text>
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>Service Details</Text>
            <Text style={styles.help}>Please provide as much information as you can.</Text>
            <Text style={styles.value}>{request.serviceDetails}</Text>
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>Assessment details</Text>
            <Text style={styles.value}>
              {request.assessmentDetails || 'No instructions added.'}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>Status</Text>
            <Text style={styles.value}>{statusLabels[request.status] ?? request.status}</Text>
          </View>
        </>
      ) : (
        <View style={styles.card}>
          <Text style={styles.notesUnavailable}>Notes are not available for Requests yet.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F5' },
  content: { paddingBottom: 24 },
  header: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  headerIcon: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  headerIconText: { color: '#16805D', fontSize: 23 },
  statusLabel: { color: '#77818A', fontSize: 13 },
  title: { color: '#17211F', fontSize: 22, fontWeight: '800' },
  clientName: { color: '#737E87', fontSize: 17, fontWeight: '600' },
  address: { color: '#667085', fontSize: 14, lineHeight: 20 },
  schedule: { marginTop: 8, gap: 4 },
  scheduleTitle: { color: '#34433D', fontSize: 15, fontWeight: '700' },
  scheduleValue: { color: '#667085', fontSize: 15 },
  scheduleSecondary: { color: '#77818A', fontSize: 14 },
  actionNotice: { paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#F3F4F5' },
  noticeText: { color: '#77818A', fontSize: 12, lineHeight: 17, textAlign: 'center' },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  actionButton: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7E9',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: '#6875D9' },
  tabText: { color: '#7A838B', fontWeight: '600' },
  activeTabText: { color: '#17211F' },
  sectionHeading: { paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#F3F4F5' },
  sectionHeadingText: { color: '#17211F', fontWeight: '700', fontSize: 16 },
  card: { padding: 18, backgroundColor: '#FFFFFF', gap: 8 },
  fieldLabel: { color: '#34433D', fontWeight: '700', fontSize: 15 },
  help: { color: '#7B858D', fontSize: 13 },
  value: { color: '#4D585F', fontSize: 15, lineHeight: 22 },
  divider: { height: 1, backgroundColor: '#ECEEEF', marginVertical: 8 },
  notesUnavailable: { color: '#77818A', textAlign: 'center', paddingVertical: 22 },
  center: { flex: 1, marginTop: 32 },
  error: { padding: 24, color: '#B42318', textAlign: 'center' },
});
