import { PostStatus, ProgressStatus, type TaskType } from '@/entities/jobPost';
import { z } from 'zod';

export interface EditPostParams {
  id: string;
  title: string;
  description: string;
  status: ProgressStatus;
  customer: string;
  location: string;
  taskType: TaskType;
  customerPhone?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
}

const phoneField = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^\+?[\d\s().-]{7,20}$/.test(value), {
    message: 'Enter a valid phone number',
  });

const dateTimeField = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
    message: 'Enter a valid date and time',
  });

export const editPostSchema = z
  .object({
    id: z.string().trim().min(1, 'Post ID cannot be empty'),
    title: z
      .string()
      .trim()
      .min(1, 'Title cannot be empty')
      .max(200, 'Title is too long (max 200 characters)'),
    description: z
      .string()
      .trim()
      .min(1, 'Description cannot be empty')
      .max(5000, 'Description is too long (max 5000 characters)'),
    status: z.enum([
      PostStatus.OPEN,
      PostStatus.SCHEDULED,
      PostStatus.INPROGRESS,
      PostStatus.COMPLETED,
      PostStatus.CANCELED,
    ]),
    customer: z
      .string()
      .trim()
      .min(1, 'Customer name cannot be empty')
      .max(100, 'Customer name is too long (max 100 characters)'),
    location: z
      .string()
      .trim()
      .min(1, 'Location cannot be empty')
      .max(200, 'Location is too long (max 200 characters)'),
    taskType: z.enum(['job_visit', 'task', 'event', 'assessment']),
    customerPhone: phoneField,
    scheduledStartTime: dateTimeField,
    scheduledEndTime: dateTimeField,
  })
  .refine(
    ({ scheduledStartTime, scheduledEndTime }) =>
      !scheduledStartTime ||
      !scheduledEndTime ||
      Date.parse(scheduledStartTime) <= Date.parse(scheduledEndTime),
    { message: 'End time cannot be before start time', path: ['scheduledEndTime'] },
  );

export type EditPostFormValues = z.infer<typeof editPostSchema>;
export type EditPostFormFields = keyof EditPostFormValues;
export type EditPostFormProps = {
  post: {
    id: string;
    title?: string;
    description?: string;
    status?: ProgressStatus;
    customer?: string;
    location?: string;
    taskType?: TaskType;
    customerPhone?: string;
    scheduledStartTime?: number;
    scheduledEndTime?: number;
  };
};
