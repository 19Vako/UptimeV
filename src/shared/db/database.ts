import { Database } from '@nozbe/watermelondb';
import adapter from './adapter';
import Comment from './model/comment';
import LineItem from './model/lineItem';
import Invoice from './model/invoice';
import InvoiceLineItem from './model/invoiceLineItem';
import JobPost from './model/jobPost';
import JobReport from './model/jobReport';
import Quote from './model/quote';
import Request from './model/request';
import Team from './model/team';

const database = new Database({
  adapter,
  modelClasses: [
    JobReport,
    Comment,
    LineItem,
    Invoice,
    InvoiceLineItem,
    JobPost,
    Request,
    Quote,
    Team,
  ],
});

export default database;
