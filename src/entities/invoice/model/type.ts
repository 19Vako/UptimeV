export const INVOICE_STATUSES = {
  DRAFT: 'draft',
  AWAITING_PAYMENT: 'awaiting_payment',
  PAST_DUE: 'past_due',
  PAID: 'paid',
  BAD_DEBT: 'bad_debt',
} as const;

export type InvoiceStatus = (typeof INVOICE_STATUSES)[keyof typeof INVOICE_STATUSES];

/** Integer amount in the currency's minor unit (for example, cents). */
export type InvoiceAmountMinor = number;

export interface InvoiceLineItemType {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: InvoiceAmountMinor;
  taxable: boolean;
}

export interface InvoiceType {
  id: string;
  invoiceNumber: string;
  clientId: string;
  jobId?: string;
  subject: string;
  issuedDate: Date;
  dueDate: Date;
  serviceDate: Date;
  billingAddress: string;
  propertyAddress: string;
  salespersonId: string;
  subtotal: InvoiceAmountMinor;
  discount: InvoiceAmountMinor;
  tax: InvoiceAmountMinor;
  deposit: InvoiceAmountMinor;
  total: InvoiceAmountMinor;
  amountPaid: InvoiceAmountMinor;
  balanceDue: InvoiceAmountMinor;
  clientMessage?: string;
  termsAndConditions?: string;
  allowPartialPayments: boolean;
  paymentMethods: string[];
  attachments: string[];
  customerSignature?: string;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;
  lineItems: InvoiceLineItemType[];
}
