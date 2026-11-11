import { REQUEST_STATUSES } from '@/entities/request';
import { TableNames } from '@/shared/constants/table-names';
import { database, Request } from '@/shared/db';
import type { RequestFormValues } from '../types';
import { dateStringToDate } from '../types';

export async function createRequest(values: RequestFormValues): Promise<Request> {
  let createdRequest!: Request;

  await database.write(async () => {
    createdRequest = await database.get<Request>(TableNames.REQUESTS).create((request) => {
      request.customerId = values.customerId || undefined;
      request.title = values.title;
      request.serviceDetails = values.serviceDetails;
      request.preferredVisitDate = dateStringToDate(values.preferredVisitDate);
      request.backupVisitDate = values.backupVisitDate
        ? dateStringToDate(values.backupVisitDate)
        : undefined;
      request.preferredTimeOfDay = values.preferredTimeOfDay;
      request.assessmentDetails = values.assessmentDetails || undefined;
      request.status = REQUEST_STATUSES.NEW;
      request.createdAt = new Date();
      request.updatedAt = new Date();
    });
  });

  return createdRequest;
}
