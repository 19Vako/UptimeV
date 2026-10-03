import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { mockJobPost } from '../mocks/mockJobPost.mock';
import { JobPostCardProps } from '../model/type';

export default function JobPostCard({ jobPost = mockJobPost }: JobPostCardProps) {
  const formattedDate = jobPost.createdAt ? jobPost.createdAt.toLocaleDateString() : '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {jobPost.title || 'Untitled'}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{jobPost.status || 'New'}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Customer:</Text>
        <Text style={styles.value} numberOfLines={1}>
          {jobPost.customer || 'Not specified'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value} numberOfLines={1}>
          {jobPost.location || 'Not specified'}
        </Text>
      </View>

      {jobPost.description ? (
        <Text style={styles.description} numberOfLines={3}>
          {jobPost.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Created: {formattedDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#E0F2EC',
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#176A51',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 6,
    width: 70,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#374151',
    marginTop: 10,
    lineHeight: 20,
  },
  footer: {
    marginTop: 12,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
