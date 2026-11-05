import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import type { AuthResponse, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/shared/api/supabase';

WebBrowser.maybeCompleteAuthSession();

function getAuthRedirectUri(): string {
  return AuthSession.makeRedirectUri({
    scheme: 'uptimev',
    path: 'auth/callback',
  });
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email,
    password,
    options: { emailRedirectTo: getAuthRedirectUri() },
  });
  if (error) throw error;
  return { data, error: null };
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ session: Session }> {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.session) throw new Error('Вход не выполнен: сессия не создана.');
  return { session: data.session };
}

export async function signInWithGoogle(): Promise<{ session: Session }> {
  const redirectTo = getAuthRedirectUri();
  const { data, error } = await getSupabaseClient().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error) throw error;
  if (!data.url) throw new Error('Supabase не вернул ссылку для входа через Google.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new Error('Вход через Google отменён.');
  }
  if (result.type !== 'success') {
    throw new Error('Не удалось завершить вход через Google.');
  }

  const callbackUrl = new URL(result.url);
  const fragment = new URLSearchParams(callbackUrl.hash.slice(1));
  const accessToken = fragment.get('access_token');
  const refreshToken = fragment.get('refresh_token');
  const oauthError =
    fragment.get('error_description') ??
    callbackUrl.searchParams.get('error_description') ??
    callbackUrl.searchParams.get('error');

  if (oauthError) throw new Error(oauthError);
  if (!accessToken || !refreshToken) {
    throw new Error('В ответе Google OAuth отсутствуют токены сессии.');
  }

  const { data: sessionData, error: sessionError } = await getSupabaseClient().auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  if (sessionError) throw sessionError;
  if (!sessionData.session) throw new Error('Supabase не создал сессию после входа через Google.');

  return { session: sessionData.session };
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabaseClient().auth.signOut({ scope: 'local' });
  if (error) throw error;
}
