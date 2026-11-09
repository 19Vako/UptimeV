import { TableNames } from '@/shared/constants/table-names';
import { Model } from '@nozbe/watermelondb';
import { date, field, text } from '@nozbe/watermelondb/decorators';

export default class Request extends Model {
  static table = TableNames.REQUESTS;

  @text('customer_id') customerId?: string;
  @text('title') title!: string;
  @text('service_details') serviceDetails!: string;
  @date('preferred_visit_date') preferredVisitDate!: Date;
  @date('backup_visit_date') backupVisitDate?: Date;
  @field('preferred_time_of_day')
  preferredTimeOfDay!: 'morning' | 'afternoon' | 'anytime';
  @text('assessment_details') assessmentDetails?: string;
  @field('status') status!: 'new' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
