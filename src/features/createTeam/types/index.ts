import { z } from 'zod';

export interface CreateTeamDTO {
  teamName: string;
  membersCount: number;
}

export const formSchema = z.object({
  teamName: z.string().min(2, 'Minimum 2 characters'),
  membersCount: z.string().min(1, 'Required field').regex(/^\d+$/, 'Numbers only'),
});

export type FormValues = z.infer<typeof formSchema>;
