import { JobPostCard, TASK_TYPE_COLORS } from '@/entities/jobPost';
import JobMapWidget from '@/widgets/jobMapWidget';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type ViewMode = 'Day' | 'List' | 'Map';
const HOUR_HEIGHT = 68;

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export default function SchedulePage() {
  const [mode, setMode] = useState<ViewMode>('Day');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscription = database
      .get<JobPost>(TableNames.JOBPOSTS)
      .query()
      .observe()
      .subscribe({
        next: (records) => {
          setPosts(records);
          setLoading(false);
          setError(null);
        },
        error: (observationError: unknown) => {
          setError(
            observationError instanceof Error
              ? observationError.message
              : 'Unable to load schedule',
          );
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, []);

  const weekDates = useMemo(() => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(date);
      day.setDate(date.getDate() + index);
      return day;
    });
  }, [selectedDate]);

  const scheduledPosts = useMemo(() => {
    const dayStart = startOfDay(selectedDate);
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    return posts
      .filter(
        (post) =>
          typeof post.scheduledStartTime === 'number' &&
          post.scheduledStartTime >= dayStart &&
          post.scheduledStartTime < dayEnd,
      )
      .sort((left, right) => (left.scheduledStartTime ?? 0) - (right.scheduledStartTime ?? 0));
  }, [posts, selectedDate]);

  const changeDate = (offset: number) => {
    setSelectedDate((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + offset);
      return next;
    });
  };

  const openPost = (post: JobPost) =>
    router.push({ pathname: '/(job)/jobPost', params: { id: post.id } });

  if (loading) return <ActivityIndicator style={styles.state} />;
  if (error) return <Text style={styles.stateMessage}>{error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        {(['Day', 'List', 'Map'] as const).map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            onPress={() => setMode(item)}
            style={[styles.segmentItem, mode === item && styles.segmentItemActive]}
          >
            <Text style={[styles.segmentText, mode === item && styles.segmentTextActive]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.weekHeader}>
        <Pressable onPress={() => changeDate(-7)} style={styles.weekArrow}>
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>
        {weekDates.map((date) => {
          const isSelected = startOfDay(date) === startOfDay(selectedDate);
          return (
            <Pressable
              key={date.toISOString()}
              onPress={() => setSelectedDate(date)}
              style={styles.weekDay}
            >
              <Text style={styles.weekDayLabel}>
                {date.toLocaleDateString([], { weekday: 'short' }).toUpperCase()}
              </Text>
              <Text style={[styles.weekDayNumber, isSelected && styles.weekDayNumberSelected]}>
                {date.getDate()}
              </Text>
            </Pressable>
          );
        })}
        <Pressable onPress={() => changeDate(7)} style={styles.weekArrow}>
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.daySummary}>
        <View>
          <Text style={styles.dayTitle}>
            {selectedDate.toLocaleDateString([], { dateStyle: 'full' })}
          </Text>
          <Text style={styles.daySubtitle}>Scheduled jobs</Text>
        </View>
        <Text style={styles.countBadge}>{scheduledPosts.length}</Text>
      </View>

      {mode === 'Map' ? (
        <View style={styles.mapContainer}>
          <JobMapWidget posts={scheduledPosts} />
        </View>
      ) : mode === 'List' ? (
        <ScrollView contentContainerStyle={styles.listContent}>
          {scheduledPosts.length ? (
            scheduledPosts.map((post) => (
              <Pressable key={post.id} onPress={() => openPost(post)}>
                <JobPostCard jobPost={post} />
              </Pressable>
            ))
          ) : (
            <Text style={styles.stateMessage}>No jobs scheduled for this day.</Text>
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.timelineScroll}>
          {scheduledPosts.length ? (
            <View style={styles.timeline} accessibilityLabel="Hourly schedule">
              {Array.from({ length: 24 }, (_, hour) => (
                <View key={hour} style={styles.hourRow}>
                  <Text style={styles.hourLabel}>
                    {new Date(2000, 0, 1, hour).toLocaleTimeString([], { hour: 'numeric' })}
                  </Text>
                  <View style={styles.hourLine} />
                </View>
              ))}
              {scheduledPosts.map((post) => {
                const dayStart = startOfDay(selectedDate);
                const start = post.scheduledStartTime!;
                const end = post.scheduledEndTime ?? start + 30 * 60 * 1000;
                const startMinutes = Math.max(0, (start - dayStart) / 60000);
                const endMinutes = Math.min(24 * 60, (end - dayStart) / 60000);
                const height = Math.max(30, ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT);
                const color = TASK_TYPE_COLORS[post.taskType] ?? TASK_TYPE_COLORS.job_visit;
                return (
                  <Pressable
                    key={post.id}
                    onPress={() => openPost(post)}
                    style={[
                      styles.timelineTask,
                      {
                        top: (startMinutes / 60) * HOUR_HEIGHT,
                        height,
                        backgroundColor: color,
                      },
                    ]}
                  >
                    <Text numberOfLines={2} style={styles.timelineTaskText}>
                      {post.title} · {post.customer} · {post.location}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text style={styles.stateMessage}>No jobs scheduled for this day.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F8' },
  segment: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 12,
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#ECECF0',
  },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 9 },
  segmentItemActive: { backgroundColor: '#fff', elevation: 1 },
  segmentText: { color: '#555', fontSize: 15, fontWeight: '500' },
  segmentTextActive: { color: '#17211F', fontWeight: '700' },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  weekArrow: { paddingHorizontal: 8 },
  arrowText: { color: '#667085', fontSize: 24 },
  weekDay: { minWidth: 34, alignItems: 'center', gap: 5 },
  weekDayLabel: { color: '#475467', fontSize: 10, fontWeight: '700' },
  weekDayNumber: { color: '#344054', fontSize: 14, padding: 5, borderRadius: 6 },
  weekDayNumberSelected: { color: '#fff', backgroundColor: '#78B20B', overflow: 'hidden' },
  daySummary: {
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D0D5DD',
  },
  dayTitle: { color: '#344054', fontSize: 13, fontWeight: '700' },
  daySubtitle: { color: '#667085', fontSize: 11 },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#EAECF0',
    color: '#475467',
    fontWeight: '700',
  },
  listContent: { padding: 12, gap: 8, flexGrow: 1 },
  timelineScroll: { flex: 1, backgroundColor: '#fff' },
  timeline: { height: HOUR_HEIGHT * 24, marginLeft: 52, position: 'relative' },
  hourRow: {
    height: HOUR_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D0D5DD',
  },
  hourLabel: {
    position: 'absolute',
    left: -48,
    top: -8,
    width: 42,
    color: '#667085',
    fontSize: 11,
    textAlign: 'right',
  },
  hourLine: { flex: 1, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#EAECF0' },
  timelineTask: {
    position: 'absolute',
    left: 8,
    right: 8,
    borderRadius: 6,
    padding: 8,
    opacity: 0.9,
    overflow: 'hidden',
  },
  timelineTaskText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  mapContainer: { flex: 1 },
  state: { flex: 1, marginTop: 40 },
  stateMessage: { flex: 1, padding: 24, color: '#667085', textAlign: 'center' },
});
