import { Stack } from 'expo-router';

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="createJobPost" />
      <Stack.Screen name="createReport" />
      <Stack.Screen name="jobPost" />
    </Stack>
  );
}
