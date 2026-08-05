import { TableNames } from '@/shared/constants/table-names';
import { Model } from '@nozbe/watermelondb';
import { date, field, text } from '@nozbe/watermelondb/decorators';

export default class SyncQueue extends Model {
  static table = TableNames.SYNCQUEUE;

  @text('entity_type') entityType!: string;
  @field('entity_id') entityId!: string;

  @field('operation') operation!: string;
  @field('status') status!: string;
  @field('retry_count') retryCount!: number;

  @date('created_at') createdAt!: Date;
  @date('last_attempt_at') lastAttemptAt?: Date;

  @text('error_message') errorMessage?: string;
}
