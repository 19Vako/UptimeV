import type { JobPost } from '@/shared/db';
import type { UserLocationState } from '@/shared/location';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function MapViewComponent({
  posts,
  userLocation,
}: {
  posts: JobPost[];
  userLocation: UserLocationState;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map is available in the iOS and Android app</Text>
      <Text style={styles.message}>
        {posts.length} jobs with{' '}
        {userLocation.location ? 'device location available' : 'no device location'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { color: '#17211F', textAlign: 'center', fontWeight: '700' },
  message: { marginTop: 8, color: '#6B7280', textAlign: 'center' },
});
