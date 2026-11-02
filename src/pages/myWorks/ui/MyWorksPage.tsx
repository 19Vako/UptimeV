import { PostStatus } from '@/entities/jobPost';
import { FALLBACK_TEAM_ID } from '@/shared/constants/mock';
import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost, JobReport } from '@/shared/db';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { JobPostListItem } from '@/widgets/jobPostList/ui/JobPostListItem';

type WorkTab = 'inProgress' | 'completed' | 'all';

export const MyWorksPage = () => {
  const [activeTab, setActiveTab] = useState<WorkTab>('inProgress');
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [reports, setReports] = useState<JobReport[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let jobsLoaded = false;
    let reportsLoaded = false;
    const updateLoading = () => {
      if (jobsLoaded && reportsLoaded) setLoading(false);
    };

    const jobsSubscription = database
      .get<JobPost>(TableNames.JOBPOSTS)
      .query()
      .observe()
      .subscribe({
        next: (records) => {
          if (!active) return;
          setPosts(records);
          jobsLoaded = true;
          updateLoading();
        },
        error: (observationError: unknown) => {
          if (active) {
            setError(
              observationError instanceof Error ? observationError.message : 'Unable to load jobs',
            );
            setLoading(false);
          }
        },
      });

    const reportsSubscription = database
      .get<JobReport>(TableNames.JOBREPORTS)
      .query()
      .observe()
      .subscribe({
        next: (records) => {
          if (!active) return;
          setReports(records);
          reportsLoaded = true;
          updateLoading();
        },
        error: (observationError: unknown) => {
          if (active) {
            setError(
              observationError instanceof Error
                ? observationError.message
                : 'Unable to load reports',
            );
            setLoading(false);
          }
        },
      });

    return () => {
      active = false;
      jobsSubscription.unsubscribe();
      reportsSubscription.unsubscribe();
    };
  }, []);

  const teamPosts = useMemo(
    () => posts.filter((post) => post.assignedTeamId === FALLBACK_TEAM_ID),
    [posts],
  );
  const filteredPosts = useMemo(() => {
    if (activeTab === 'inProgress') {
      return teamPosts.filter(
        (post) => post.status === PostStatus.SCHEDULED || post.status === PostStatus.INPROGRESS,
      );
    }

    if (activeTab === 'completed') {
      return teamPosts.filter((post) => post.status === PostStatus.COMPLETED);
    }

    const query = search.trim().toLocaleLowerCase();
    return teamPosts.filter(
      (post) =>
        !query ||
        post.title.toLocaleLowerCase().includes(query) ||
        post.customer.toLocaleLowerCase().includes(query),
    );
  }, [activeTab, search, teamPosts]);

  const tabs: { key: WorkTab; label: string }[] = [
    { key: 'inProgress', label: 'In progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'all', label: 'All jobs' },
  ];

  if (loading) return <ActivityIndicator style={styles.state} />;
  if (error) return <Text style={styles.stateMessage}>{error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'all' ? (
        <TextInput
          accessibilityLabel="Search jobs"
          value={search}
          onChangeText={setSearch}
          placeholder="Search by job or customer"
          placeholderTextColor="#98A2B3"
          style={styles.search}
        />
      ) : null}

      <ScrollView contentContainerStyle={styles.list}>
        {filteredPosts.map((post) => {
          const jobReports = reports.filter(
            (report) => report.jobId === post.id && report.teamId === FALLBACK_TEAM_ID,
          );
          return (
            <View key={post.id}>
              <JobPostListItem jobPost={post} />
              {activeTab === 'completed' && jobReports.length > 0 ? (
                <View style={styles.reportBox}>
                  <Text style={styles.reportHeading}>
                    {jobReports.length} {jobReports.length === 1 ? 'report' : 'reports'}
                  </Text>
                  {jobReports.map((report) => (
                    <Text key={report.id} style={styles.reportDescription}>
                      {report.description}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
        {filteredPosts.length === 0 ? (
          <Text style={styles.stateMessage}>
            {activeTab === 'all' && search.trim()
              ? 'No matching jobs found.'
              : activeTab === 'completed'
                ? 'No completed jobs yet.'
                : activeTab === 'all'
                  ? 'No jobs found.'
                  : 'No jobs in progress.'}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(job)/createJobPost')}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>Create job</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    padding: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: { backgroundColor: '#fff' },
  tabText: { color: '#667085', fontSize: 12, fontWeight: '500' },
  activeTabText: { color: '#17211F', fontWeight: '700' },
  search: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: '#fff',
    color: '#17211F',
  },
  list: { paddingHorizontal: 12, paddingBottom: 24, flexGrow: 1 },
  reportBox: {
    marginTop: -4,
    marginBottom: 10,
    marginHorizontal: 6,
    padding: 12,
    backgroundColor: '#E9F0ED',
    borderRadius: 10,
  },
  reportHeading: { color: '#176A51', fontWeight: '700', marginBottom: 4 },
  reportDescription: { color: '#34413D', fontSize: 13, marginTop: 3 },
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#16805D',
  },
  createButtonText: { color: '#fff', fontWeight: '800' },
  state: { flex: 1, marginTop: 32 },
  stateMessage: { flex: 1, padding: 24, textAlign: 'center', color: '#667085' },
});

export default MyWorksPage;
