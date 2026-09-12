import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';

export const getPostById = (id: string): Promise<JobPost> => {
  return database.get<JobPost>(TableNames.JOBPOSTS).find(id);
};
