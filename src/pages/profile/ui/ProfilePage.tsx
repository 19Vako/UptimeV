import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/features/auth';
import { ActionButton } from '@/shared/ui';
import { ProfileWidget } from '@/widgets/profile';

export default function ProfilePage() {
  const router = useRouter();
  const { user, team, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const handleSignOut = async () => {
    setSigningOut(true);
    setError(null);
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign out.');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Employee Profile</Text>
        {user ? <ProfileWidget user={user} team={team} /> : null}
        <Text style={styles.note}>
          Your role appears here only if it has been assigned by the server.
        </Text>
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        {signingOut ? <ActivityIndicator color="#16805D" /> : null}
        <ActionButton title="Sign Out" secondary onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F7F5' },
  content: { flex: 1, justifyContent: 'center', gap: 18, padding: 22 },
  title: { color: '#17211F', fontSize: 26, fontWeight: '800' },
  note: { color: '#66736D', fontSize: 13, lineHeight: 18 },
  error: { color: '#B42318', fontSize: 14 },
});
