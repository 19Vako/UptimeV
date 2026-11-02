import { database, JobPost } from '@/shared/db';
import { TableNames } from '@/shared/constants/table-names';
import { useUserLocation } from '@/shared/location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MapViewComponent } from '@/features/jobMap';

export function JobMapWidget({ posts: suppliedPosts }: { posts?: JobPost[] }) {
  const [posts, setPosts] = useState<JobPost[]>(suppliedPosts ?? []);
  const [loading, setLoading] = useState(!suppliedPosts);
  const [error, setError] = useState<string | null>(null);
  const userLocation = useUserLocation();

  useEffect(() => {
    if (suppliedPosts) {
      setPosts(suppliedPosts);
      setLoading(false);
      return;
    }

    let active = true;
    const subscription = database
      .get<JobPost>(TableNames.JOBPOSTS)
      .query()
      .observe()
      .subscribe({
        next: (records) => {
          if (active) {
            setPosts(records);
            setLoading(false);
          }
        },
        error: (observationError: unknown) => {
          if (active) {
            setError(
              observationError instanceof Error
                ? observationError.message
                : 'Unable to load jobs for map',
            );
            setLoading(false);
          }
        },
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [suppliedPosts]);

  if (loading || userLocation.loading) {
    return <ActivityIndicator style={styles.loading} />;
  }
  if (error) {
    return (
      <View style={styles.state}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return <MapViewComponent posts={posts} userLocation={userLocation} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, marginTop: 40 },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  error: { color: '#B42318', textAlign: 'center' },
});
