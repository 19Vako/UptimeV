import { TableNames } from '@/shared/constants/table-names';
import { database, Request } from '@/shared/db';
import type { RequestFormValues } from '@/features/createRequest';
import { dateStringToDate } from '@/features/createRequest';

export async function updateRequest(id: string, values: RequestFormValues): Promise<void> {
  await database.write(async () => {
    const request = await database.get<Request>(TableNames.REQUESTS).find(id);
    await request.update((record) => {
      record.customerId = values.customerId || undefined;
      record.title = values.title;
      record.serviceDetails = values.serviceDetails;
      record.preferredVisitDate = dateStringToDate(values.preferredVisitDate);
      record.backupVisitDate = values.backupVisitDate
        ? dateStringToDate(values.backupVisitDate)
        : undefined;
      record.preferredTimeOfDay = values.preferredTimeOfDay;
      record.assessmentDetails = values.assessmentDetails || undefined;
      record.updatedAt = new Date();
    });
  });
}
