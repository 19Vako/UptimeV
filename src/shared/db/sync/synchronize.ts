import { synchronize } from '@nozbe/watermelondb/sync';
import database from '../database';

export async function sync() {
  await synchronize({
    database,

    async pullChanges({ lastPulledAt, schemaVersion, migration }) {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_PULL_CHANGES_API}?lastPulledAt=${lastPulledAt || 0}`,
      );

      if (!response.ok) {
        throw new Error('Get error');
      }

      const { changes, timestamp } = await response.json();

      return { changes, timestamp };
    },

    async pushChanges({ changes, lastPulledAt }) {
      const response = await fetch(`${process.env.EXPO_PUBLIC_PUSH_CHANGES_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ changes, lastPulledAt }),
      });

      if (!response.ok) {
        throw new Error('Send error');
      }
    },

    migrationsEnabledAtVersion: 1,
  });
}
