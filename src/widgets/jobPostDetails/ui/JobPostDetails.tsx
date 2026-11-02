import { AcceptJobButton } from '@/features/acceptJob';
import { CancelJobProgressButton } from '@/features/cancelJobProgress';
import { getPostById } from '@/features/getPosts';
import JobPostHeader from '@/widgets/jobPostHeader';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { JobPost, JobPostDetailsProps } from '../type';
import { ExpandableDetailItem } from './ExpandableDetailItem';

export function JobPostDetails({ teamId, postId }: JobPostDetailsProps) {
  const [post, setPost] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    setLoading(true);
    setError(null);

    getPostById(postId)
      .then((loadedPost) => {
        if (!isMounted) return;
        const subscription = loadedPost.observe().subscribe({
          next: (updatedPost) => {
            setPost(updatedPost);
            setLoading(false);
          },
          error: (observationError: unknown) =>
            setError(
              observationError instanceof Error
                ? observationError.message
                : 'Failed to observe post',
            ),
        });
        unsubscribe = () => subscription.unsubscribe();
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
      unsubscribe?.();
    };
  }, [postId]);

  if (loading) {
    return <ActivityIndicator style={styles.state} />;
  }

  if (error) {
    return <Text style={styles.stateText}>{error}</Text>;
  }

  if (!post) {
    return <Text style={styles.stateText}>Post not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <JobPostHeader post={post} />
      <View style={styles.detailsGrid}>
        <ExpandableDetailItem
          label="Description"
          value={post.description || 'No description available'}
        />
        <ExpandableDetailItem label="Customer" value={post.customer || 'Not specified'} />
        <ExpandableDetailItem label="Address" value={post.location || 'Not specified'} />
        <ExpandableDetailItem label="Created" value={post.createdAt.toLocaleDateString()} />
        <ExpandableDetailItem label="Updated" value={post.updatedAt.toLocaleDateString()} />
        <ExpandableDetailItem label="Task type" value={post.taskType.replace('_', ' ')} />
        {post.customerPhone ? (
          <ExpandableDetailItem label="Phone" value={post.customerPhone} />
        ) : null}
        {post.scheduledStartTime ? (
          <ExpandableDetailItem
            label="Scheduled"
            value={`${new Date(post.scheduledStartTime).toLocaleString()}${
              post.scheduledEndTime
                ? ` – ${new Date(post.scheduledEndTime).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}`
                : ''
            }`}
          />
        ) : null}
      </View>

      {post.status === 'open' ? (
        <AcceptJobButton
          postId={postId}
          teamId={teamId}
          onAccepted={() =>
            router.push({
              pathname: '/(job)/(tabs)/myWorks',
              params: { id: postId },
            })
          }
        />
      ) : null}
      {post.status === 'in_progress' || post.status === 'scheduled' ? (
        <View style={styles.workActions}>
          <Pressable
            style={styles.finishButton}
            onPress={() =>
              router.push({
                pathname: '/(job)/createReport',
                params: { id: postId, teamId },
              })
            }
          >
            <Text style={styles.finishButtonText}>Create completion report</Text>
          </Pressable>
          {post.status === 'in_progress' ? (
            <CancelJobProgressButton jobId={postId} teamId={teamId} />
          ) : null}
        </View>
      ) : null}
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
  detailsGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    color: '#71807C',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  workActions: { gap: 12, paddingVertical: 4 },
  finishButton: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#16805D',
  },
  finishButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
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
