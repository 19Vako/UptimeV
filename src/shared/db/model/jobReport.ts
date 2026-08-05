import { TableNames } from '@/shared/constants/table-names';
import { Model } from '@nozbe/watermelondb';
import { date, relation, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

export default class JobReport extends Model {
  static table = TableNames.JOBREPORTS;

  static associations: Associations = {
    report_photos: { type: 'has_many', foreignKey: 'report_id' },
  };

  @relation('job_posts', 'job_id') job_id!: string;
  @text('description') description!: string;

  @date('arrival_at') arrival_at!: Date;
  @date('started_at') started_at!: Date;
  @date('finished_at') finished_at!: Date;

  @text('customer_signature_uri') customer_signature_uri!: string;
  @text('document_scan_uri') document_scan_uri!: string;
}
