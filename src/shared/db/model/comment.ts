import { TableNames } from '@/shared/constants/table-names';
import { Model, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { date, relation, text } from '@nozbe/watermelondb/decorators';

import JobPost from './jobPost';

export default class Comment extends Model {
  static table = TableNames.COMMENTS;

  static associations: Associations = {
    [TableNames.JOBPOSTS]: { type: 'belongs_to', key: 'job_post_id' },
  };

  @relation(TableNames.JOBPOSTS, 'job_post_id') jobPost!: Relation<JobPost>;

  @text('comment') comment!: string;
  @date('created_at') createdAt!: Date;
}
