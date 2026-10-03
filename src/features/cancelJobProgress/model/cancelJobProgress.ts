import { PostStatus } from '@/entities/jobPost';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { CancelJobProgressInput } from '../type';

export const cancelJobProgress = async ({
  jobId,
  teamId,
}: CancelJobProgressInput): Promise<void> => {
  await database.write(async () => {
    const theJob = await database.get<JobPost>(TableNames.JOBPOSTS).find(jobId);

    if (theJob.assignedTeamId !== teamId) {
      throw new Error('Job is not assigned to this team');
    }

    if (theJob.status !== PostStatus.INPROGRESS) {
      throw new Error('Only in-progress jobs can be cancelled');
    }

    await theJob.update((job) => {
      job.status = PostStatus.OPEN;
      job.assignedTeamId = undefined;
    });
  });
};
