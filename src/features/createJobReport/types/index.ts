import { z } from 'zod';

const dateTimeField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: `${label} must be a valid date and time`,
    });

export const createReportSchema = z
  .object({
    description: z
      .string()
      .trim()
      .min(1, 'Description cannot be empty')
      .max(5000, 'Description is too long (max 5000 characters)'),
    arrivalAt: dateTimeField('Arrival time'),
    startedAt: dateTimeField('Start time'),
    finishedAt: dateTimeField('Finish time'),
    customerSignatureUri: z.string().trim().optional(),
    documentScanUri: z.string().trim().optional(),
  })
  .refine(({ arrivalAt, startedAt }) => Date.parse(arrivalAt) <= Date.parse(startedAt), {
    message: 'Start time cannot be before arrival time',
    path: ['startedAt'],
  })
  .refine(({ startedAt, finishedAt }) => Date.parse(startedAt) <= Date.parse(finishedAt), {
    message: 'Finish time cannot be before start time',
    path: ['finishedAt'],
  });

export type CreateReportFormValues = z.infer<typeof createReportSchema>;
export type CreateReportFormFields = keyof CreateReportFormValues;
