import { INVOICE_STATUSES } from '@/entities/invoice';
import { PostStatus } from '@/entities/jobPost';
import { QUOTE_STATUSES } from '@/entities/quote';
import { REQUEST_STATUSES } from '@/entities/request';
import { observeInvoices } from '@/features/getInvoices';
import { observeJobs } from '@/features/getJobs';
import { observeQuotes } from '@/features/getQuotes';
import { observeRequests } from '@/features/getRequests';
import type { Invoice, JobPost, Quote, Request } from '@/shared/db';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { WorkflowItem, WorkflowStatusGroup } from './WorkflowSection';
import { WorkflowSection } from './WorkflowSection';

function requestGroups(records: Request[]): WorkflowStatusGroup[] {
  const groups = [
    { key: REQUEST_STATUSES.NEW, label: 'New' },
    { key: REQUEST_STATUSES.IN_PROGRESS, label: 'Assessment in progress' },
    { key: REQUEST_STATUSES.COMPLETED, label: 'Assessments completed' },
    { key: REQUEST_STATUSES.REJECTED, label: 'Rejected' },
    { key: REQUEST_STATUSES.CANCELLED, label: 'Cancelled' },
  ];

  return groups.map(({ key, label }) => ({
    key,
    label,
    items: records
      .filter((record) => record.status === key)
      .map((record) => ({
        id: record.id,
        title: record.title,
        detail: `${record.serviceDetails} · ${record.preferredVisitDate.toLocaleDateString()}`,
        onPress: () =>
          router.push({ pathname: '/(job)/request-detail', params: { id: record.id } }),
      })),
  }));
}

function quoteGroups(records: Quote[]): WorkflowStatusGroup[] {
  const groups = [
    { key: QUOTE_STATUSES.DRAFT, label: 'Draft' },
    { key: QUOTE_STATUSES.SENT, label: 'Sent' },
    { key: QUOTE_STATUSES.CHANGES_REQUESTED, label: 'Changes requested' },
    { key: QUOTE_STATUSES.APPROVED, label: 'Approved' },
    { key: QUOTE_STATUSES.REJECTED, label: 'Rejected' },
    { key: QUOTE_STATUSES.EXPIRED, label: 'Expired' },
  ];

  return groups.map(({ key, label }) => ({
    key,
    label,
    items: records
      .filter((record) => record.status === key)
      .map((record) => ({ id: record.id, title: record.title })),
  }));
}

function jobGroups(records: JobPost[], invoices: Invoice[]): WorkflowStatusGroup[] {
  const needingAction = [PostStatus.OPEN, PostStatus.SCHEDULED, PostStatus.INPROGRESS];
  const invoicedJobIds = new Set(
    invoices.map((invoice) => invoice.jobId).filter((id): id is string => Boolean(id)),
  );

  const makeItems = (jobs: JobPost[]): WorkflowItem[] =>
    jobs.map((job) => ({
      id: job.id,
      title: job.title,
      detail: [job.customer, job.description].filter(Boolean).join(' · '),
      onPress: () => router.push({ pathname: '/(job)/jobPost', params: { id: job.id } }),
    }));

  return [
    {
      key: 'require-action',
      label: 'Require action',
      items: makeItems(
        records.filter((job) => needingAction.some((status) => status === job.status)),
      ),
    },
    {
      key: 'require-invoicing',
      label: 'Require invoicing',
      items: makeItems(
        records.filter((job) => job.status === PostStatus.COMPLETED && !invoicedJobIds.has(job.id)),
      ),
    },
    {
      key: 'invoiced',
      label: 'Invoiced',
      items: makeItems(
        records.filter((job) => job.status === PostStatus.COMPLETED && invoicedJobIds.has(job.id)),
      ),
    },
    {
      key: PostStatus.CANCELED,
      label: 'Canceled',
      items: makeItems(records.filter((job) => job.status === PostStatus.CANCELED)),
    },
  ];
}

function invoiceGroups(records: Invoice[]): WorkflowStatusGroup[] {
  const groups = [
    { key: INVOICE_STATUSES.DRAFT, label: 'Draft' },
    { key: INVOICE_STATUSES.AWAITING_PAYMENT, label: 'Awaiting payment' },
    { key: INVOICE_STATUSES.PAST_DUE, label: 'Past due' },
    { key: INVOICE_STATUSES.PAID, label: 'Paid' },
    { key: INVOICE_STATUSES.BAD_DEBT, label: 'Bad debt' },
  ];

  return groups.map(({ key, label }) => ({
    key,
    label,
    items: records
      .filter((record) => record.status === key)
      .map((record) => ({
        id: record.id,
        title: record.invoiceNumber,
        detail: `${record.subject} · Due ${record.dueDate.toLocaleDateString()}`,
      })),
  }));
}

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {sections.map((section) => (
        <View key={section.title} style={styles.timelineSection}>
          <View style={[styles.timeline, { backgroundColor: section.color }]} />
          <WorkflowSection {...section} />
        </View>
      ))}
    </ScrollView>
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
