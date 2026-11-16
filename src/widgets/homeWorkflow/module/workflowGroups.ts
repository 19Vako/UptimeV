import { INVOICE_STATUSES } from '@/entities/invoice';
import { PostStatus } from '@/entities/jobPost';
import { QUOTE_STATUSES } from '@/entities/quote';
import { REQUEST_STATUSES } from '@/entities/request';
import type { Invoice, JobPost, Quote, Request } from '@/shared/db';
import { router } from 'expo-router';
import type { WorkflowItem, WorkflowStatusGroup } from '../type';

export function requestGroups(records: Request[]): WorkflowStatusGroup[] {
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

export function quoteGroups(records: Quote[]): WorkflowStatusGroup[] {
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

export function jobGroups(records: JobPost[], invoices: Invoice[]): WorkflowStatusGroup[] {
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

export function invoiceGroups(records: Invoice[]): WorkflowStatusGroup[] {
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
