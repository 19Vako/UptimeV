import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { EmailOtpType } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/shared/api/supabase';

const OTP_TYPES: readonly EmailOtpType[] = [
  'signup',
  'magiclink',
  'recovery',
  'invite',
  'email_change',
  'email',
];

function isOtpType(value: string | null): value is EmailOtpType {
  return value !== null && OTP_TYPES.includes(value as EmailOtpType);
}

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const processing = useRef(false);

  useEffect(() => {
    let active = true;

    const processUrl = async (url: string | null) => {
      if (!url || processing.current) return;
      processing.current = true;
      try {
        const parsed = new URL(url);
        const fragment = new URLSearchParams(parsed.hash.slice(1));
        const accessToken = fragment.get('access_token') ?? parsed.searchParams.get('access_token');
        const refreshToken =
          fragment.get('refresh_token') ?? parsed.searchParams.get('refresh_token');
        const tokenHash = parsed.searchParams.get('token_hash') ?? fragment.get('token_hash');
        const otpType = parsed.searchParams.get('type') ?? fragment.get('type');
        const code = parsed.searchParams.get('code');

        const client = getSupabaseClient();
        if (accessToken && refreshToken) {
          const { error: sessionError } = await client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
        } else if (code) {
          const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (tokenHash && isOtpType(otpType)) {
          const { error: verifyError } = await client.auth.verifyOtp({
            token_hash: tokenHash,
            type: otpType,
          });
          if (verifyError) throw verifyError;
        } else {
          const description =
            parsed.searchParams.get('error_description') ?? fragment.get('error_description');
          throw new Error(description ?? 'Ссылка авторизации недействительна или устарела.');
        }

        if (active) router.replace('/');
      } catch (reason) {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : 'Не удалось подтвердить авторизацию.',
          );
          processing.current = false;
        }
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => {
      void processUrl(url);
    });
    void Linking.getInitialURL().then(processUrl);
    return () => {
      active = false;
      subscription.remove();
    };
  }, [router]);

  return (
    <View style={styles.center}>
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : (
        <>
          <ActivityIndicator size="large" color="#16805D" />
          <Text style={styles.text}>Подтверждаем авторизацию…</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 },
  text: { color: '#66736D', fontSize: 15 },
  error: { color: '#B42318', fontSize: 15, textAlign: 'center' },
});
