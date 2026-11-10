import type { TaskType } from '@/entities/jobPost/model/type';
import { TableNames } from '@/shared/constants/table-names';
import { Model, Query, Relation } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { children, date, field, relation, text } from '@nozbe/watermelondb/decorators';

import Comment from './comment';
import Invoice from './invoice';
import JobReport from './jobReport';
import Team from './team';

export default class JobPost extends Model {
  static table = TableNames.JOBPOSTS;

  static associations: Associations = {
    [TableNames.COMMENTS]: { type: 'has_many', foreignKey: 'job_post_id' },
    [TableNames.JOBREPORTS]: { type: 'has_many', foreignKey: 'job_id' },
    [TableNames.INVOICES]: { type: 'has_many', foreignKey: 'job_id' },
    [TableNames.TEAMS]: { type: 'belongs_to', key: 'assigned_team_id' },
  };

  @children(TableNames.COMMENTS) comments!: Query<Comment>;
  @children(TableNames.JOBREPORTS) reports!: Query<JobReport>;
  @children(TableNames.INVOICES) invoices!: Query<Invoice>;

  @relation(TableNames.TEAMS, 'assigned_team_id') team?: Relation<Team>;

  @text('title') title!: string;
  @text('description') description!: string;
  @text('status') status!: string;
  @text('task_type') taskType!: string;
  @field('time_spent') timeSpent?: number;
  @field('start_time') startTime?: number;
  @field('end_time') endTime?: number;
  @field('scheduled_start_time') scheduledStartTime?: number;
  @field('scheduled_end_time') scheduledEndTime?: number;

  @text('customer_id') customerId!: string;
  @text('assigned_team_id') assignedTeamId?: string;
  @text('customer') customer!: string;
  @text('customer_phone') customerPhone?: string;

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @text('location') location!: string;
  @field('latitude') latitude?: number;
  @field('longitude') longitude?: number;
}
