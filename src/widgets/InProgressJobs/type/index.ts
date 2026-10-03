import { JobPost } from '@/shared/db';

export type JobPostListItemProps = {
  jobPost: JobPost;
};

export interface InProgressJobsProps {
  teamId: string;
}
