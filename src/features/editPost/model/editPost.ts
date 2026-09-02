import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { EditPostParams } from '../types';

export const editPost = async (params: EditPostParams) => {
  const { id, title, description, status, customer, location, latitude, longitude } = params;

  await database.write(async () => {
    const post = database.get<JobPost>(TableNames.JOBPOSTS).find(id);

    (await post).update((record) => {
      record.title = title ?? record.title;
      record.description = description ?? record.description;
      record.status = status ?? record.status;
      record.customer = customer ?? record.customer;
      record.location = location ?? record.location;
      record.latitude = latitude ?? record.latitude;
      record.longitude = longitude ?? record.longitude;
      record.updatedAt = new Date();
    });
  });
};
