import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { Q } from '@nozbe/watermelondb';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { JobPostListItem } from './JobPostListItem';

export function JobPostList() {
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const subscription = database
      .get<JobPost>(TableNames.JOBPOSTS)
      .query(Q.where('status', 'open'))
      .observe()
      .subscribe({
        next: (records) => {
          if (active) {
            setPosts(records);
            setIsLoading(false);
            setError(null);
          }
        },
        error: (loadError: unknown) => {
          if (active) {
            setError(loadError instanceof Error ? loadError.message : 'Failed to load posts');
            setIsLoading(false);
          }
        },
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator style={styles.state} />;
  }

  if (error) {
    return <Text style={styles.stateText}>{error}</Text>;
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(post) => post.id}
      renderItem={({ item }) => <JobPostListItem jobPost={item} />}
      contentContainerStyle={posts.length === 0 ? styles.emptyList : styles.list}
      ListEmptyComponent={<Text style={styles.stateText}>No posts found</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyList: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  item: {
    borderRadius: 16,
  },
  itemPressed: {
    opacity: 0.7,
  },
  state: {
    flex: 1,
    marginTop: 32,
  },
  stateText: {
    padding: 24,
    textAlign: 'center',
    color: '#6B7280',
  },
});
