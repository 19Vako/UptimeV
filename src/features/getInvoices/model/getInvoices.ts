import { TableNames } from '@/shared/constants/table-names';
import { database, Invoice } from '@/shared/db';

export function observeInvoices() {
  return database.get<Invoice>(TableNames.INVOICES).query().observe();
}
