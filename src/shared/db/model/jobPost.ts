import { TableNames } from '@/shared/constants/table-names';
import { Model, Query } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { children, date, field, text } from '@nozbe/watermelondb/decorators';

import Comment from './comment';
import JobReport from './jobReport';

export default class JobPost extends Model {
  static table = TableNames.JOBPOSTS;

  static associations: Associations = {
    [TableNames.COMMENTS]: { type: 'has_many', foreignKey: 'job_post_id' },
    [TableNames.JOBREPORTS]: { type: 'has_many', foreignKey: 'job_id' },
  };

  @children(TableNames.COMMENTS) comments!: Query<Comment>;
  @children(TableNames.JOBREPORTS) reports!: Query<JobReport>;

  @text('title') title!: string;
  @text('description') description!: string;
  @field('status') status!: string;

  @field('customer_id') customerId!: string;
  @text('customer') customer!: string;

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @text('location') location!: string;
  @field('latitude') latitude?: number;
  @field('longitude') longitude?: number;
}
