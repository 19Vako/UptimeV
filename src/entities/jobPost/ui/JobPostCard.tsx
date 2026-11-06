import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { JobPostCardProps, TASK_TYPE_COLORS, TaskType } from '../model/type';

const formatDuration = (seconds: number) => {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export default function JobPostCard({ jobPost }: JobPostCardProps) {
  const formattedDate = jobPost.createdAt ? jobPost.createdAt.toLocaleDateString() : '';
  const taskColor = TASK_TYPE_COLORS[jobPost.taskType as TaskType] ?? TASK_TYPE_COLORS.job_visit;

  return (
    <View style={styles.card}>
      <View style={[styles.typeIndicator, { backgroundColor: taskColor }]} />
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

      {jobPost.timeSpent && jobPost.timeSpent > 0 ? (
        <Text style={styles.timeSpent}>Time logged: {formatDuration(jobPost.timeSpent)}</Text>
      ) : null}
      {jobPost.scheduledStartTime ? (
        <Text style={styles.scheduleTime}>
          Scheduled: {jobPost.scheduledStartTime.toLocaleString()}
          {jobPost.scheduledEndTime
            ? ` – ${new Date(jobPost.scheduledEndTime).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
              })}`
            : ''}
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
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    overflow: 'hidden',
  },
  typeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
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
  timeSpent: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  scheduleTime: { marginTop: 6, color: '#667085', fontSize: 13 },
});
