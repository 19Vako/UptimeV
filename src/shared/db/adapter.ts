import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import migrations from './migrationSchema';
import { schema } from './schema';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true,
});

export default adapter;
