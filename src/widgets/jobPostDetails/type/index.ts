export { JobPost } from '@/shared/db';

export interface JobPostDetailsProps {
  postId: string;
  teamId: string;
}

export type ExpandableDetailItemProps = {
  label: string;
  value: string;
};
