import { Link, useRouter, type Href } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionButton, FormField } from '@/shared/ui';
import { useAuth } from '../model/AuthProvider';

type Props = { mode: 'login' | 'register' };

function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return 'Не удалось выполнить запрос. Попробуйте ещё раз.';
  if (/network|fetch/i.test(error.message)) {
    return 'Нет подключения к интернету. Проверьте сеть и повторите попытку.';
  }
  return error.message;
}

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const { signInWithPassword, signInWithGoogle, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === 'register';

  const authenticate = async (method: () => Promise<unknown>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      await method();
      router.replace('/');
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitEmail = async () => {
    if (isSubmitting) return;
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Введите корректный адрес электронной почты.');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов.');
      return;
    }

    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    try {
      if (isRegister) {
        const { data } = await signUp(normalizedEmail, password);
        if (!data.session) {
          setNotice('Аккаунт создан. Проверьте почту и подтвердите адрес, затем войдите.');
          return;
        }
      } else {
        await signInWithPassword(normalizedEmail, password);
      }
      router.replace('/');
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.eyebrow}>UPTIMEV</Text>
          <Text style={styles.title}>{isRegister ? 'Создать аккаунт' : 'С возвращением'}</Text>
          <Text style={styles.subtitle}>
            {isRegister
              ? 'Зарегистрируйтесь, чтобы настроить профиль и команду.'
              : 'Войдите, чтобы продолжить работу.'}
          </Text>

          <View style={styles.fields}>
            <FormField
              label="Электронная почта"
              value={email}
              editable={!isSubmitting}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <FormField
              label="Пароль"
              value={password}
              editable={!isSubmitting}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry
              textContentType={isRegister ? 'newPassword' : 'password'}
              onSubmitEditing={() => void submitEmail()}
              returnKeyType="go"
            />
          </View>

          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
          {notice ? (
            <Text accessibilityRole="alert" style={styles.notice}>
              {notice}
            </Text>
          ) : null}

          <ActionButton
            title={isRegister ? 'Зарегистрироваться' : 'Войти'}
            onPress={submitEmail}
            disabled={isSubmitting}
          />
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>или</Text>
            <View style={styles.dividerLine} />
          </View>
          <ActionButton
            title="Продолжить с Google"
            secondary
            onPress={() => authenticate(signInWithGoogle)}
            disabled={isSubmitting}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isRegister ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
            </Text>
            <Link
              href={(isRegister ? '/(auth)/login' : '/(auth)/register') as Href}
              style={styles.link}
            >
              {isRegister ? 'Войти' : 'Зарегистрироваться'}
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F3F7F5' },
  content: { flexGrow: 1, justifyContent: 'center', padding: 22 },
  card: {
    gap: 18,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#10251C',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  eyebrow: { color: '#16805D', fontSize: 12, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: '#17211F', fontSize: 27, fontWeight: '800' },
  subtitle: { marginTop: -10, color: '#66736D', fontSize: 15, lineHeight: 21 },
  fields: { gap: 14 },
  error: { color: '#B42318', fontSize: 14 },
  notice: { color: '#176A51', fontSize: 14, lineHeight: 20 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E6ECE8' },
  dividerText: { color: '#7A8781', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  footerText: { color: '#66736D', fontSize: 14 },
  link: { color: '#16805D', fontSize: 14, fontWeight: '700' },
});
