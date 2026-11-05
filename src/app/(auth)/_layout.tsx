import { Redirect, Stack, usePathname } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/features/auth';

export default function AuthLayout() {
  const { session, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16805D" />
      </View>
    );
  }
  if (session && (pathname.endsWith('/login') || pathname.endsWith('/register'))) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="create-team" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
