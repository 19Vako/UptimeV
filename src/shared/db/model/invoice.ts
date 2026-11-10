import { TableNames } from '@/shared/constants/table-names';
import { Model, Query, Relation } from '@nozbe/watermelondb';
import { children, date, field, json, relation, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import type InvoiceLineItem from './invoiceLineItem';
import type JobPost from './jobPost';

const sanitizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

export default class Invoice extends Model {
  static table = TableNames.INVOICES;

  static associations: Associations = {
    [TableNames.JOBPOSTS]: { type: 'belongs_to', key: 'job_id' },
    [TableNames.INVOICE_LINE_ITEMS]: { type: 'has_many', foreignKey: 'invoice_id' },
  };

  @relation(TableNames.JOBPOSTS, 'job_id') job?: Relation<JobPost>;
  @children(TableNames.INVOICE_LINE_ITEMS) lineItems!: Query<InvoiceLineItem>;

  @text('invoice_number') invoiceNumber!: string;
  @text('client_id') clientId!: string;
  @text('job_id') jobId?: string;
  @text('subject') subject!: string;
  @date('issued_date') issuedDate!: Date;
  @date('due_date') dueDate!: Date;
  @date('service_date') serviceDate!: Date;
  @text('billing_address') billingAddress!: string;
  @text('property_address') propertyAddress!: string;
  @text('salesperson_id') salespersonId!: string;
  @field('subtotal') subtotal!: number;
  @field('discount') discount!: number;
  @field('tax') tax!: number;
  @field('deposit') deposit!: number;
  @field('total') total!: number;
  @field('amount_paid') amountPaid!: number;
  @field('balance_due') balanceDue!: number;
  @text('client_message') clientMessage?: string;
  @text('terms_and_conditions') termsAndConditions?: string;
  @field('allow_partial_payments') allowPartialPayments!: boolean;
  @json('payment_methods', sanitizeStringArray) paymentMethods!: string[];
  @json('attachments', sanitizeStringArray) attachments!: string[];
  @text('customer_signature') customerSignature?: string;
  @field('status')
  status!: 'draft' | 'awaiting_payment' | 'past_due' | 'paid' | 'bad_debt';
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
