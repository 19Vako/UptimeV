import { PostStatus } from '@/entities/jobPost';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';

interface CreatePostArgs {
  title: string;
  description: string;
  customerId: string;
  location: string;
  customer: string;
  latitude: number;
  longitude: number;
}

export const createJobPost = async ({
  title,
  description,
  customerId,
  location,
  customer,
  latitude,
  longitude,
}: CreatePostArgs) => {
  await database.write(async () => {
    const postsCollection = database.get<JobPost>(TableNames.JOBPOSTS);

    await postsCollection.create((post) => {
      post.title = title;
      post.description = description;
      post.status = PostStatus.OPEN;
      post.customerId = customerId;
      post.customer = customer;
      post.location = location;
      post.latitude = latitude;
      post.longitude = longitude;
    });
  });
};
