import { PostStatus } from '@/entities/jobPost';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';

export const acceptJob = async (id: string): Promise<void> => {
  await database.write(async () => {
    const theJob = await database.get<JobPost>(TableNames.JOBPOSTS).find(id);
    await theJob.update((job) => {
      job.status = PostStatus.INPROGRESS;
    });
  });
};
