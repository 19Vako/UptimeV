import type { TaskType } from '@/entities/jobPost';
import { z } from 'zod';

export interface CreatePostArgs {
  title: string;
  description: string;
  customerId: string;
  location: string;
  customer: string;
  taskType: TaskType;
  customerPhone?: string;
  scheduledStartTime?: number;
  scheduledEndTime?: number;
  latitude?: number;
  longitude?: number;
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

export const createPostSchema = z
  .object({
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
    customerId: z.string().trim().min(1, 'Customer ID cannot be empty'),
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
    latitude: z
      .number()
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90')
      .optional(),
    longitude: z
      .number()
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180')
      .optional(),
  })
  .refine(
    ({ scheduledStartTime, scheduledEndTime }) =>
      !scheduledStartTime ||
      !scheduledEndTime ||
      Date.parse(scheduledStartTime) <= Date.parse(scheduledEndTime),
    { message: 'End time cannot be before start time', path: ['scheduledEndTime'] },
  );

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
export type CreatePostFormFields = keyof CreatePostFormValues;
