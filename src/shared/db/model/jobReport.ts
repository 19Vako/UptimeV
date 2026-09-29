import { TableNames } from '@/shared/constants/table-names';
import { Model, Relation } from '@nozbe/watermelondb';
import { date, relation, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';
import JobPost from './jobPost';
import Team from './team';

export default class JobReport extends Model {
  static table = TableNames.JOBREPORTS;

  static associations: Associations = {
    report_photos: { type: 'has_many', foreignKey: 'report_id' },
    [TableNames.JOBPOSTS]: { type: 'belongs_to', key: 'job_id' },
    [TableNames.TEAMS]: { type: 'belongs_to', key: 'team_id' },
  };

  @relation(TableNames.JOBPOSTS, 'job_id') jobPost!: Relation<JobPost>;
  @relation(TableNames.TEAMS, 'team_id') assignedTeam!: Relation<Team>;

  @text('job_id') jobId!: string;
  @text('team_id') teamId!: string;
  @text('description') description!: string;

  @date('arrival_at') arrival_at!: Date;
  @date('started_at') started_at!: Date;
  @date('finished_at') finished_at!: Date;

  @text('customer_signature_uri') customer_signature_uri?: string;
  @text('document_scan_uri') document_scan_uri?: string;
}
