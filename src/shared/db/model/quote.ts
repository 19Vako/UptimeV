import { TableNames } from '@/shared/constants/table-names';
import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, relation, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import type Request from './request';

export default class Quote extends Model {
  static table = TableNames.QUOTES;

  static associations: Associations = {
    [TableNames.REQUESTS]: { type: 'belongs_to', key: 'request_id' },
  };

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
