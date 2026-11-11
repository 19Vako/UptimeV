import { TableNames } from '@/shared/constants/table-names';
import { database, Request } from '@/shared/db';

export async function deleteRequest(id: string): Promise<void> {
  await database.write(async () => {
    const request = await database.get<Request>(TableNames.REQUESTS).find(id);
    await request.markAsDeleted();
  });
}
