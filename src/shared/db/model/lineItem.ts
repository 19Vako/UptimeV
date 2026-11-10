import { TableNames } from '@/shared/constants/table-names';
import { Model, Relation } from '@nozbe/watermelondb';
import { field, relation, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import type Quote from './quote';

export default class LineItem extends Model {
  static table = TableNames.LINE_ITEMS;

  static associations: Associations = {
    [TableNames.QUOTES]: { type: 'belongs_to', key: 'quote_id' },
  };

  @relation(TableNames.QUOTES, 'quote_id') quote!: Relation<Quote>;

  @text('quote_id') quoteId!: string;
  @text('name') name!: string;
  @text('description') description!: string;
  @field('unit_price') unitPrice!: number;
  @field('quantity') quantity!: number;
  @text('photo_url') photoUrl?: string;
}
