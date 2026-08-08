import { JobPost } from '@/shared/db';

export type JobPostCardProps = {
  jobPost?: JobPost;
};

export const PostStatus = {
  OPEN: 'open',
  INPROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
} as const;

export type ProgressStatus = (typeof PostStatus)[keyof typeof PostStatus];
