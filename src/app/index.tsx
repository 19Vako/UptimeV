import { Redirect } from 'expo-router';

export default function Index() {
  const isAuthenticated = true;

  return <Redirect href={isAuthenticated ? '/(job)/(tabs)/home' : '/(auth)/login'} />;
}
