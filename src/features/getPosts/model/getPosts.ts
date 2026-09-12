import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { Q } from '@nozbe/watermelondb';

export const getPosts = (): Promise<JobPost[]> => {
  return database.get<JobPost>(TableNames.JOBPOSTS).query(Q.where('status', 'open')).fetch();
};
