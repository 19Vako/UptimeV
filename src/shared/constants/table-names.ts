export const TableNames = {
  JOBPOSTS: 'job_posts',
  JOBREPORTS: 'job_reports',
  COMMENTS: 'comments',
  SYNCQUEUE: 'sync_queue',
} as const;

export type TableName = (typeof TableNames)[keyof typeof TableNames];
