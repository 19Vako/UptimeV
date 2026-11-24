export const QUOTE_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CHANGES_REQUESTED: 'changes_requested',
  EXPIRED: 'expired',
} as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[keyof typeof QUOTE_STATUSES];

export interface QuoteType {
  id: string;
  requestId?: string;
  customerId?: string;
  title: string;
  total: number;
  discount: number;
  discountPercent?: number;
  tax: number;
  requiredDeposit: number;
  clientMessage?: string;
  status: QuoteStatus;
  signatureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
