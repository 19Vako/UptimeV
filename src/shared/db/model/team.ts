import { TableNames } from '@/shared/constants/table-names';
import { Model, Query } from '@nozbe/watermelondb';
import { children, date, field, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import JobPost from './jobPost';
import JobReport from './jobReport';

export default class Team extends Model {
  static table = TableNames.TEAMS;

  static associations: Associations = {
    [TableNames.JOBREPORTS]: { type: 'has_many', foreignKey: 'team_id' },
    [TableNames.JOBPOSTS]: { type: 'has_many', foreignKey: 'assigned_team_id' },
  };

  @text('team_name') teamName!: string;
  @field('members_count') membersCount!: number;
  @text('status') status!: string;
  @children(TableNames.JOBREPORTS) jobReports!: Query<JobReport>;
  @children(TableNames.JOBPOSTS) jobPosts!: Query<JobPost>;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt?: Date;
}
