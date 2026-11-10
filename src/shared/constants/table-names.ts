export const TableNames = {
  JOBPOSTS: 'job_posts',
  JOBREPORTS: 'job_reports',
  COMMENTS: 'comments',
  TEAMS: 'teams',
  REQUESTS: 'requests',
  QUOTES: 'quotes',
  LINE_ITEMS: 'line_items',
  INVOICES: 'invoices',
  INVOICE_LINE_ITEMS: 'invoice_line_items',
} as const;

export type TableName = (typeof TableNames)[keyof typeof TableNames];
