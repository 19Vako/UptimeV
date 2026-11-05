import { Redirect, Stack, type Href } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/features/auth';

export default function JobLayout() {
  const { session, loading, teamStatus } = useAuth();

  if (loading || (session && teamStatus === 'checking')) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16805D" />
      </View>
    );
  }
  if (!session) return <Redirect href="/(auth)/login" />;
  if (teamStatus !== 'ready') {
    return <Redirect href={'/(auth)/create-team' as Href} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="createJobPost" />
      <Stack.Screen name="createReport" />
      <Stack.Screen name="jobPost" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
