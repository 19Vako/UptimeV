export const TableNames = {
  JOBPOSTS: 'job_posts',
  JOBREPORTS: 'job_reports',
  COMMENTS: 'comments',
  TEAMS: 'teams',
  REQUESTS: 'requests',
  QUOTES: 'quotes',
} as const;

export type TableName = (typeof TableNames)[keyof typeof TableNames];
