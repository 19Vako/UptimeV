import { Stack } from 'expo-router';
import { AuthProvider } from '@/features/auth';

export default function _layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { paddingTop: 50 },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(job)" />
        <Stack.Screen name="auth/callback" />
      </Stack>
    </AuthProvider>
  );
}
