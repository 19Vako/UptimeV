import { getTeamJobReports } from '@/features/getTeamJobReports';
import { JobReport } from '@/shared/db';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { PastJobReportsProps } from '../type';
import { PastJobReportsItem } from './PastJobReportsItem';

export function PastJobReports({ teamId }: PastJobReportsProps) {
  const [reports, setReports] = useState<JobReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTeamJobReports(teamId)
      .then(setReports)
      .catch(() => setError('Failed to load reports'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <ActivityIndicator style={styles.state} />;
  }

  if (error) {
    return <Text style={styles.stateText}>{error}</Text>;
  }

  return (
    <FlatList
      data={reports}
      keyExtractor={(post) => post.id}
      renderItem={({ item }) => <PastJobReportsItem item={item} />}
      contentContainerStyle={reports.length === 0 ? styles.emptyList : styles.list}
      ListEmptyComponent={<Text style={styles.stateText}>No reports found</Text>}
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
