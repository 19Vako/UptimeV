import { Redirect, type Href } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/features/auth';

export default function Index() {
  const { session, loading, authError, teamStatus } = useAuth();

  if (loading || (session && teamStatus === 'checking')) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16805D" />
      </View>
    );
  }
  if (authError && !session) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{authError}</Text>
      </View>
    );
  }
  if (!session) return <Redirect href="/(auth)/login" />;
  if (teamStatus === 'ready') return <Redirect href="/(job)/(tabs)/home" />;
  return <Redirect href={'/(auth)/create-team' as Href} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  error: { color: '#B42318', fontSize: 15, textAlign: 'center' },
});
