import { REQUEST_STATUSES } from '@/entities/request';
import { TableNames } from '@/shared/constants/table-names';
import { database, Request } from '@/shared/db';

export async function completeAssessment(requestId: string): Promise<void> {
  await database.write(async () => {
    const request = await database.get<Request>(TableNames.REQUESTS).find(requestId);
    await request.update((record) => {
      record.status = REQUEST_STATUSES.COMPLETED;
      record.updatedAt = new Date();
    });
  });
}
