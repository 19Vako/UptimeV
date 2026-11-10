import { TableNames } from '@/shared/constants/table-names';
import { Model, Relation } from '@nozbe/watermelondb';
import { field, relation, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import type Invoice from './invoice';

export default class InvoiceLineItem extends Model {
  static table = TableNames.INVOICE_LINE_ITEMS;

  static associations: Associations = {
    [TableNames.INVOICES]: { type: 'belongs_to', key: 'invoice_id' },
  };

  @relation(TableNames.INVOICES, 'invoice_id') invoice!: Relation<Invoice>;

  @text('invoice_id') invoiceId!: string;
  @text('description') description!: string;
  @field('quantity') quantity!: number;
  @field('unit_price') unitPrice!: number;
  @field('taxable') taxable!: boolean;
}
