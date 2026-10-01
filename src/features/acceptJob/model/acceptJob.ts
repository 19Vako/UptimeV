import { PostStatus } from '@/entities/jobPost';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { AcceptJobProps } from '../type';

export const acceptJob = async ({ postId, teamId }: AcceptJobProps): Promise<void> => {
  await database.write(async () => {
    const theJob = await database.get<JobPost>(TableNames.JOBPOSTS).find(postId);
    await theJob.update((job) => {
      job.status = PostStatus.INPROGRESS;
      job.assignedTeamId = teamId;
    });
  });
};
