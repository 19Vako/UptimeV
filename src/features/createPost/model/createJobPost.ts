import { PostStatus } from '@/entities/jobPost';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { CreatePostArgs } from '../types';

export const createJobPost = async ({
  title,
  description,
  customerId,
  location,
  customer,
  taskType,
  customerPhone,
  scheduledStartTime,
  scheduledEndTime,
  latitude,
  longitude,
}: CreatePostArgs) => {
  await database.write(async () => {
    const postsCollection = database.get<JobPost>(TableNames.JOBPOSTS);

    await postsCollection.create((post) => {
      post.title = title;
      post.description = description;
      post.status = PostStatus.OPEN;
      post.taskType = taskType;
      post.timeSpent = 0;
      post.customerId = customerId;
      post.customer = customer;
      post.location = location;
      post.customerPhone = customerPhone?.trim() || undefined;
      post.scheduledStartTime = scheduledStartTime;
      post.scheduledEndTime = scheduledEndTime;
      post.latitude = latitude;
      post.longitude = longitude;
    });
  });
};
