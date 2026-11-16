import { observeInvoices } from '@/features/getInvoices';
import { observeJobs } from '@/features/getJobs';
import { observeQuotes } from '@/features/getQuotes';
import { observeRequests } from '@/features/getRequests';
import type { Invoice, JobPost, Quote, Request } from '@/shared/db';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { invoiceGroups, jobGroups, quoteGroups, requestGroups } from '../module/workflowGroups';
import { WorkflowSection } from './WorkflowSection';

export function HomeWorkflowWidget() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loaded, setLoaded] = useState({
    requests: false,
    quotes: false,
    jobs: false,
    invoices: false,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const subscriptions = [
      observeRequests().subscribe({
        next: (records) => {
          if (!active) return;
          setRequests(records);
          setLoaded((value) => ({ ...value, requests: true }));
        },
        error: (loadError: unknown) =>
          active &&
          setError(loadError instanceof Error ? loadError.message : 'Unable to load requests.'),
      }),
      observeQuotes().subscribe({
        next: (records) => {
          if (!active) return;
          setQuotes(records);
          setLoaded((value) => ({ ...value, quotes: true }));
        },
        error: (loadError: unknown) =>
          active &&
          setError(loadError instanceof Error ? loadError.message : 'Unable to load quotes.'),
      }),
      observeJobs().subscribe({
        next: (records) => {
          if (!active) return;
          setJobs(records);
          setLoaded((value) => ({ ...value, jobs: true }));
        },
        error: (loadError: unknown) =>
          active &&
          setError(loadError instanceof Error ? loadError.message : 'Unable to load jobs.'),
      }),
      observeInvoices().subscribe({
        next: (records) => {
          if (!active) return;
          setInvoices(records);
          setLoaded((value) => ({ ...value, invoices: true }));
        },
        error: (loadError: unknown) =>
          active &&
          setError(loadError instanceof Error ? loadError.message : 'Unable to load invoices.'),
      }),
    ];

    return () => {
      active = false;
      subscriptions.forEach((subscription) => subscription.unsubscribe());
    };
  }, []);

  const sections = useMemo(
    () => [
      {
        title: 'Requests',
        color: '#596FCB',
        icon: 'file-tray-full-outline' as const,
        groups: requestGroups(requests),
      },
      {
        title: 'Quotes',
        color: '#BF5A9B',
        icon: 'search-outline' as const,
        groups: quoteGroups(quotes),
      },
      {
        title: 'Jobs',
        color: '#A9C91A',
        icon: 'hammer-outline' as const,
        groups: jobGroups(jobs, invoices),
      },
      {
        title: 'Invoices',
        color: '#8066B8',
        icon: 'receipt-outline' as const,
        groups: invoiceGroups(invoices),
      },
    ],
    [requests, quotes, jobs, invoices],
  );

  if (error) return <Text style={styles.stateText}>{error}</Text>;
  if (!Object.values(loaded).every(Boolean)) {
    return <ActivityIndicator style={styles.loading} color="#16805D" />;
  }

  return (
    <FlatList
      data={sections}
      keyExtractor={(section) => section.title}
      renderItem={({ item: section }) => (
        <View style={styles.timelineSection}>
          <View style={[styles.timeline, { backgroundColor: section.color }]} />
          <WorkflowSection {...section} />
        </View>
      )}
      style={styles.container}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 22 },
  timelineSection: { position: 'relative', paddingBottom: 16 },
  timeline: { position: 'absolute', top: 56, bottom: -16, left: 28, width: 4 },
  loading: { flex: 1, marginTop: 32 },
  stateText: { flex: 1, padding: 24, color: '#B42318', textAlign: 'center' },
  emptyText: { color: '#77818A', fontSize: 15, textAlign: 'center' },
});
