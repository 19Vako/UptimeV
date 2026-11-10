import { TableNames } from '@/shared/constants/table-names';
import { Model, Query, Relation } from '@nozbe/watermelondb';
import { children, date, field, relation, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import LineItem from './lineItem';
import type Request from './request';

export default class Quote extends Model {
  static table = TableNames.QUOTES;

  static associations: Associations = {
    [TableNames.REQUESTS]: { type: 'belongs_to', key: 'request_id' },
    [TableNames.LINE_ITEMS]: { type: 'has_many', foreignKey: 'quote_id' },
  };

  @children(TableNames.LINE_ITEMS) lineItems!: Query<LineItem>;
  @relation(TableNames.REQUESTS, 'request_id') request?: Relation<Request>;
  @text('request_id') requestId?: string;
  @text('customer_id') customerId?: string;
  @text('title') title!: string;
  @field('total') total!: number;
  @field('discount') discount!: number;
  @field('tax') tax!: number;
  @field('required_deposit') requiredDeposit!: number;
  @text('client_message') clientMessage?: string;
  @field('status')
  status!: 'draft' | 'sent' | 'approved' | 'rejected' | 'changes_requested' | 'expired';
  @text('signature_url') signatureUrl?: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
