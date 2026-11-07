import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/features/auth';
import { ActionButton } from '@/shared/ui';
import { CreateTeamWidget } from '@/widgets/createTeam';

export default function CreateTeamPage() {
  const router = useRouter();
  const { user, team, teamStatus, teamError, refreshTeamStatus, signOut } = useAuth();
  const [actionError, setActionError] = useState<string | null>(null);

  if (!user) return <Redirect href="/(auth)/login" />;
  if (teamStatus === 'ready' && team) return <Redirect href="/(job)/(tabs)/home" />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>НАСТРОЙКА ПРОФИЛЯ</Text>
        <Text style={styles.title}>Создайте команду</Text>
        {teamStatus === 'checking' ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#16805D" />
            <Text style={styles.description}>Проверяем данные команды…</Text>
          </View>
        ) : teamStatus === 'error' ? (
          <>
            <Text accessibilityRole="alert" style={styles.description}>
              {teamError ??
                'Не удалось проверить команду. Для продолжения необходимо подключение к сети.'}
            </Text>
            {actionError ? (
              <Text accessibilityRole="alert" style={styles.description}>
                {actionError}
              </Text>
            ) : null}
            <ActionButton title="Повторить проверку" onPress={() => refreshTeamStatus()} />
            <ActionButton
              title="Выйти"
              secondary
              onPress={async () => {
                try {
                  await signOut();
                  router.replace('/(auth)/login');
                } catch (error) {
                  setActionError(
                    error instanceof Error ? error.message : 'Не удалось выйти из аккаунта.',
                  );
                }
              }}
            />
          </>
        ) : (
          <>
            <Text style={styles.description}>
              Чтобы начать работу, заполните обязательные данные команды.
            </Text>
            <CreateTeamWidget
              userId={user.id}
              onSuccess={async () => {
                const status = await refreshTeamStatus();
                if (status === 'ready') router.replace('/(job)/(tabs)/home');
              }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: 'center', backgroundColor: '#F3F7F5', padding: 22 },
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
  eyebrow: { color: '#16805D', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#17211F', fontSize: 26, fontWeight: '800' },
  description: { color: '#66736D', fontSize: 15, lineHeight: 21 },
  loading: { alignItems: 'center', gap: 16, paddingVertical: 18 },
});
