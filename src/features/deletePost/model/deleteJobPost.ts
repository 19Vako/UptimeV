import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';

export const deleteJobPost = async (id: string) => {
  const postId = id;

  if (!postId) {
    throw new Error('Post ID cannot be empty');
  }

  await database.write(async () => {
    const post = await database.get<JobPost>(TableNames.JOBPOSTS).find(postId);

    await post.markAsDeleted();
  });
};
