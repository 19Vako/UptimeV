import { TableNames } from '@/shared/constants/table-names';
import { database, Request } from '@/shared/db';

export function observeRequests() {
  return database.get<Request>(TableNames.REQUESTS).query().observe();
}

export function observeRequest(id: string) {
  return database
    .get<Request>(TableNames.REQUESTS)
    .find(id)
    .then((request) => request.observe());
}
