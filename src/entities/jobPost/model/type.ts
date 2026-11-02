import { JobPost } from '@/shared/db';

export type JobPostCardProps = {
  jobPost: JobPost;
};

export type TaskType = 'job_visit' | 'task' | 'event' | 'assessment';

export interface JobPostType {
  id: string;
  title: string;
  description: string;
  status: string;
  taskType: TaskType;
  timeSpent?: number;
  startTime?: number;
  endTime?: number;
  scheduledStartTime?: number;
  scheduledEndTime?: number;
  customerId: string;
  assignedTeamId?: string;
  customer: string;
  customerPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  location: string;
  latitude?: number;
  longitude?: number;
}

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  job_visit: '#22C55E',
  task: '#3B82F6',
  event: '#EAB308',
  assessment: '#A855F7',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  job_visit: 'Job visit',
  task: 'Task',
  event: 'Event',
  assessment: 'Assessment',
};

export const PostStatus = {
  OPEN: 'open',
  SCHEDULED: 'scheduled',
  INPROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
} as const;

export type ProgressStatus = (typeof PostStatus)[keyof typeof PostStatus];
