import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { TableNames } from '../constants/table-names';

export const schema = appSchema({
  version: 6,
  tables: [
    tableSchema({
      name: TableNames.JOBPOSTS,
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'task_type', type: 'string' },
        { name: 'time_spent', type: 'number', isOptional: true },
        { name: 'start_time', type: 'number', isOptional: true },
        { name: 'end_time', type: 'number', isOptional: true },
        { name: 'scheduled_start_time', type: 'number', isOptional: true },
        { name: 'scheduled_end_time', type: 'number', isOptional: true },
        { name: 'customer_id', type: 'string' },
        { name: 'assigned_team_id', type: 'string', isOptional: true },
        { name: 'customer', type: 'string' },
        { name: 'customer_phone', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'location', type: 'string' },
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
      ],
    }),

    tableSchema({
      name: TableNames.COMMENTS,
      columns: [
        { name: 'job_post_id', type: 'string' },
        { name: 'comment', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: TableNames.JOBREPORTS,
      columns: [
        { name: 'job_id', type: 'string' },
        { name: 'team_id', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'arrival_at', type: 'number' },
        { name: 'started_at', type: 'number' },
        { name: 'finished_at', type: 'number' },
        { name: 'customer_signature_uri', type: 'string', isOptional: true },
        { name: 'document_scan_uri', type: 'string', isOptional: true },
      ],
    }),

    tableSchema({
      name: TableNames.TEAMS,
      columns: [
        { name: 'team_name', type: 'string' },
        { name: 'members_count', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
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

    tableSchema({
      name: TableNames.QUOTES,
      columns: [
        { name: 'request_id', type: 'string', isOptional: true },
        { name: 'customer_id', type: 'string', isOptional: true },
        { name: 'title', type: 'string' },
        { name: 'total', type: 'number' },
        { name: 'discount', type: 'number' },
        { name: 'tax', type: 'number' },
        { name: 'required_deposit', type: 'number' },
        { name: 'client_message', type: 'string', isOptional: true },
        { name: 'status', type: 'string' },
        { name: 'signature_url', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
