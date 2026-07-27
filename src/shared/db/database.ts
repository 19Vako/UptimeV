import { Database } from '@nozbe/watermelondb';
import adapter from './adapter';
import Comment from './model/comment';
import JobPost from './model/jobPost';
import JobReport from './model/jobReport';

const database = new Database({
  adapter,
  modelClasses: [JobReport, Comment, JobPost],
});

export default database;
