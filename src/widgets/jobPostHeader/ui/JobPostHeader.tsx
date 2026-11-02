import { CallCustomerButton, SendSmsButton } from '@/features/contactCustomer';
import { JobTimerButton } from '@/features/jobTimer';
import type { JobPost } from '@/shared/db';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function JobPostHeader({ post }: { post: JobPost }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.status}>{post.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <Text style={styles.title}>{post.title || 'Untitled job'}</Text>
      <Text style={styles.customer}>{post.customer || 'Customer not specified'}</Text>
      <View style={styles.actions}>
        <CallCustomerButton phone={post.customerPhone} />
        <SendSmsButton phone={post.customerPhone} />
      </View>
      {post.status === 'in_progress' || post.status === 'scheduled' ? (
        <JobTimerButton jobId={post.id} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, paddingTop: 4 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  backText: { color: '#17211F', fontSize: 30, lineHeight: 34 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E0F2EC',
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#16805D' },
  status: { color: '#176A51', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: '#17211F', fontSize: 26, fontWeight: '800' },
  customer: { color: '#475467', fontSize: 16 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
});
