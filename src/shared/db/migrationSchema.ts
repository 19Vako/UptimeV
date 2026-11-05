import { addColumns, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
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
  ],
});
