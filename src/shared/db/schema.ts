import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { TableNames } from '../constants/table-names';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: TableNames.JOBPOSTS,
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'customer_id', type: 'string' },
        { name: 'customer', type: 'string' },
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
        { name: 'description', type: 'string' },
        { name: 'arrival_at', type: 'number' },
        { name: 'started_at', type: 'number' },
        { name: 'finished_at', type: 'number' },
        { name: 'customer_signature_uri', type: 'string', isOptional: true },
        { name: 'document_scan_uri', type: 'string', isOptional: true },
      ],
    }),

    tableSchema({
      name: TableNames.SYNCQUEUE,
      columns: [
        { name: 'entity_type', type: 'string' },
        { name: 'entity_id', type: 'string' },
        { name: 'operation', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'retry_count', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'last_attempt_at', type: 'number', isOptional: true },
        { name: 'error_message', type: 'string', isOptional: true },
      ],
    }),
  ],
});
