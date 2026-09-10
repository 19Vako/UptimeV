import { CancelJobProgressButton } from '@/features/cancelJobProgress';
import { getPostById } from '@/features/getPosts';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { JobPost, MyWorkDetailsProps } from '../type';

export function MyWorkDetails({ id }: MyWorkDetailsProps) {
  const [post, setPost] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    getPostById(id)
      .then((loadedPost) => {
        if (isMounted) {
          setPost(loadedPost);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load post');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={styles.state} />;
  }

  if (error) {
    return <Text style={styles.stateText}>{error}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.eyebrowRow}>
          <Text style={styles.eyebrow}>JOB POST</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.status}>{post!.status}</Text>
          </View>
        </View>
        <Text style={styles.title}>{post!.title || 'Untitled post'}</Text>
      </View>

      <View style={styles.descriptionBlock}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.description}>{post!.description || 'No description available'}</Text>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Customer</Text>
          <Text style={styles.value} numberOfLines={2}>
            {post!.customer || 'Not specified'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value} numberOfLines={2}>
            {post!.location || 'Not specified'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Created</Text>
          <Text style={styles.value}>{post!.createdAt.toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Updated</Text>
          <Text style={styles.value}>{post!.updatedAt.toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: '/(job)/createReport',
              params: { id: id },
            })
          }
          style={({ pressed }) => [styles.completeButton, pressed && styles.buttonPressed]}
        >
          <Text style={styles.completeButtonText}>Finish</Text>
        </Pressable>
        <CancelJobProgressButton postId={id} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F7F6',
    padding: 20,
    gap: 20,
  },
  header: {
    paddingTop: 8,
    gap: 10,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#71807C',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E0F2EC',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16805D',
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '800',
    color: '#17211F',
  },
  status: {
    color: '#176A51',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  descriptionBlock: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2EAE7',
    gap: 9,
  },
  description: {
    color: '#34413D',
    fontSize: 16,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailItem: {
    width: '48%',
    minHeight: 90,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#E9F0ED',
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#71807C',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: '#26332F',
  },
  actions: {
    gap: 10,
  },
  completeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#16805D',
  },

  buttonPressed: {
    opacity: 0.82,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
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
