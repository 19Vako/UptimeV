export const QUOTE_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CHANGES_REQUESTED: 'changes_requested',
  EXPIRED: 'expired',
} as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[keyof typeof QUOTE_STATUSES];

/** Integer amount in the currency's minor unit (for example, cents). */
export type MinorUnitAmount = number;

export interface QuoteType {
  id: string;
  requestId?: string;
  customerId?: string;
  title: string;
  total: MinorUnitAmount;
  discount: MinorUnitAmount;
  tax: MinorUnitAmount;
  requiredDeposit: MinorUnitAmount;
  clientMessage?: string;
  status: QuoteStatus;
  signatureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
