import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

const CHUNK_SIZE = 450;

const secureStorage = {
  async getItem(key: string) {
    const generation = await SecureStore.getItemAsync(`${key}.active`);
    if (!generation) return null;

    const countValue = await SecureStore.getItemAsync(`${key}.${generation}.count`);
    const chunkCount = Number(countValue);
    if (!Number.isInteger(chunkCount) || chunkCount < 1) {
      throw new Error('Secure session storage is incomplete. Please sign in again.');
    }

    const chunks = await Promise.all(
      Array.from({ length: chunkCount }, (_, index) =>
        SecureStore.getItemAsync(`${key}.${generation}.${index}`),
      ),
    );
    if (chunks.some((chunk) => chunk === null)) {
      throw new Error('Secure session storage is incomplete. Please sign in again.');
    }

    return chunks.join('');
  },

  async setItem(key: string, value: string) {
    const previousGeneration = await SecureStore.getItemAsync(`${key}.active`);
    const generation = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const chunks = value.match(new RegExp(`.{1,${CHUNK_SIZE}}`, 'gs')) ?? [''];

    await Promise.all(
      chunks.map((chunk, index) =>
        SecureStore.setItemAsync(`${key}.${generation}.${index}`, chunk),
      ),
    );
    await SecureStore.setItemAsync(`${key}.${generation}.count`, String(chunks.length));
    await SecureStore.setItemAsync(`${key}.active`, generation);

    if (previousGeneration) {
      const previousCount = Number(
        await SecureStore.getItemAsync(`${key}.${previousGeneration}.count`),
      );
      if (Number.isInteger(previousCount) && previousCount > 0) {
        await Promise.all([
          ...Array.from({ length: previousCount }, (_, index) =>
            SecureStore.deleteItemAsync(`${key}.${previousGeneration}.${index}`),
          ),
          SecureStore.deleteItemAsync(`${key}.${previousGeneration}.count`),
        ]);
      }
    }
  },

  async removeItem(key: string) {
    const generation = await SecureStore.getItemAsync(`${key}.active`);
    await SecureStore.deleteItemAsync(`${key}.active`);
    if (!generation) return;

    const count = Number(await SecureStore.getItemAsync(`${key}.${generation}.count`));
    if (Number.isInteger(count) && count > 0) {
      await Promise.all([
        ...Array.from({ length: count }, (_, index) =>
          SecureStore.deleteItemAsync(`${key}.${generation}.${index}`),
        ),
        SecureStore.deleteItemAsync(`${key}.${generation}.count`),
      ]);
    }
  },
};

let supabase: SupabaseClient<Database> | undefined;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabase) return supabase;

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.',
    );
  }

  supabase = createClient<Database>(url, publishableKey, {
    auth: {
      storage: secureStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return supabase;
}
