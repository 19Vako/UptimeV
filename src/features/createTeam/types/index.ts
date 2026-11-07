import { z } from 'zod';

export interface CreateTeamDTO {
  teamName: string;
  membersCount: number;
}

export const formSchema = z.object({
  teamName: z.string().min(2, 'Minimum 2 characters'),
  membersCount: z.number().int().min(1, 'Укажите целое число участников больше нуля.'),
});

export type FormValues = z.infer<typeof formSchema>;
