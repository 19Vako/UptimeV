import { PostStatus, ProgressStatus } from '@/entities/jobPost';
import { z } from 'zod';

export interface EditPostParams {
  id: string;
  title: string;
  description: string;
  status: ProgressStatus;
  customer: string;
  location: string;
  latitude: number;
  longitude: number;
}

export const editPostSchema = z.object({
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
  latitude: z
    .number({ error: 'Invalid latitude value' })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number({ error: 'Invalid longitude value' })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
});

export type EditPostFormValues = z.infer<typeof editPostSchema>;
export type EditPostFormFields = keyof EditPostFormValues;
export type EditPostFormProps = {
  post: Partial<EditPostFormValues> & { id: string };
};
