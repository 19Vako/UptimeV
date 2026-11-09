import {
  addColumns,
  createTable,
  schemaMigrations,
  unsafeExecuteSql,
} from '@nozbe/watermelondb/Schema/migrations';
import { TableNames } from '../constants/table-names';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: TableNames.JOBPOSTS,
          columns: [
            { name: 'task_type', type: 'string', isOptional: true },
            { name: 'time_spent', type: 'number', isOptional: true },
            { name: 'start_time', type: 'number', isOptional: true },
            { name: 'end_time', type: 'number', isOptional: true },
            { name: 'scheduled_start_time', type: 'number', isOptional: true },
            { name: 'scheduled_end_time', type: 'number', isOptional: true },
            { name: 'customer_phone', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: TableNames.TEAMS,
          columns: [{ name: 'owner_id', type: 'string', isOptional: true }],
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        unsafeExecuteSql(
          'UPDATE job_posts SET assigned_team_id = (SELECT owner_id FROM teams WHERE teams.id = job_posts.assigned_team_id) WHERE assigned_team_id IN (SELECT id FROM teams WHERE owner_id IS NOT NULL AND owner_id != id);',
        ),
        unsafeExecuteSql(
          'UPDATE job_reports SET team_id = (SELECT owner_id FROM teams WHERE teams.id = job_reports.team_id) WHERE team_id IN (SELECT id FROM teams WHERE owner_id IS NOT NULL AND owner_id != id);',
        ),
        unsafeExecuteSql(
          'UPDATE teams SET id = owner_id WHERE owner_id IS NOT NULL AND owner_id != id AND NOT EXISTS (SELECT 1 FROM teams AS existing WHERE existing.id = teams.owner_id);',
        ),
      ],
    },
    {
      toVersion: 5,
      steps: [
        createTable({
          name: TableNames.REQUESTS,
          columns: [
            { name: 'customer_id', type: 'string', isOptional: true },
            { name: 'title', type: 'string' },
            { name: 'service_details', type: 'string' },
            { name: 'preferred_visit_date', type: 'number' },
            { name: 'backup_visit_date', type: 'number', isOptional: true },
            { name: 'preferred_time_of_day', type: 'string' },
            { name: 'assessment_details', type: 'string', isOptional: true },
            { name: 'status', type: 'string' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
      ],
    },
  ],
});
