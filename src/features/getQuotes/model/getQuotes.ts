import { TableNames } from '@/shared/constants/table-names';
import { database, Quote } from '@/shared/db';

export function observeQuotes() {
  return database.get<Quote>(TableNames.QUOTES).query().observe();
}
