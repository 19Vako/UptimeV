import * as SecureStore from 'expo-secure-store';
import { TableNames } from '../constants/table-names';
import database from './database';
import Comment from './model/comment';
import LineItem from './model/lineItem';
import Invoice from './model/invoice';
import InvoiceLineItem from './model/invoiceLineItem';
import JobPost from './model/jobPost';
import JobReport from './model/jobReport';
import Quote from './model/quote';
import Request from './model/request';
import Team from './model/team';

const LOCAL_DATA_USER_KEY = 'uptimev.local-data-user';

async function clearLocalDatabase() {
  const records = await Promise.all([
    database.get<JobPost>(TableNames.JOBPOSTS).query().fetch(),
    database.get<Comment>(TableNames.COMMENTS).query().fetch(),
    database.get<LineItem>(TableNames.LINE_ITEMS).query().fetch(),
    database.get<InvoiceLineItem>(TableNames.INVOICE_LINE_ITEMS).query().fetch(),
    database.get<Invoice>(TableNames.INVOICES).query().fetch(),
    database.get<JobReport>(TableNames.JOBREPORTS).query().fetch(),
    database.get<Request>(TableNames.REQUESTS).query().fetch(),
    database.get<Quote>(TableNames.QUOTES).query().fetch(),
    database.get<Team>(TableNames.TEAMS).query().fetch(),
  ]);
  const deletions = records.flatMap((tableRecords) =>
    tableRecords.map((record) => record.prepareDestroyPermanently()),
  );

  if (deletions.length > 0) {
    await database.write(() => database.batch(...deletions));
  }
}

export async function bindLocalDataToUser(userId: string): Promise<void> {
  const storedUserId = await SecureStore.getItemAsync(LOCAL_DATA_USER_KEY);
  if (storedUserId !== userId) {
    await clearLocalDatabase();
    await SecureStore.setItemAsync(LOCAL_DATA_USER_KEY, userId);
  }
}
