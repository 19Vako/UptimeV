import { z } from 'zod';

const isValidDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return (
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
  );
};

const requiredDate = z
  .string()
  .trim()
  .refine(isValidDate, 'Enter a valid date in YYYY-MM-DD format.');

const optionalDate = z
  .string()
  .trim()
  .refine((value) => !value || isValidDate(value), 'Enter a valid date in YYYY-MM-DD format.');

export const requestFormSchema = z
  .object({
    customerId: z.string().trim().optional(),
    title: z.string().trim().min(1, 'Enter a request title.').max(200),
    serviceDetails: z.string().trim().min(1, 'Enter the service details.').max(5000),
    preferredVisitDate: requiredDate,
    backupVisitDate: optionalDate,
    preferredTimeOfDay: z.enum(['morning', 'afternoon', 'anytime']),
    assessmentDetails: z.string().trim().max(5000),
  })
  .refine(
    ({ preferredVisitDate, backupVisitDate }) =>
      !backupVisitDate || backupVisitDate >= preferredVisitDate,
    {
      message: 'The alternate date must be on or after the preferred date.',
      path: ['backupVisitDate'],
    },
  );

export type RequestFormValues = z.infer<typeof requestFormSchema>;

export function dateStringToDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function dateToDateString(value?: Date): string {
  if (!value || Number.isNaN(value.getTime())) return '';
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
