import InProgressJobs from '@/widgets/InProgressJobs';
import PastJobReports from '@/widgets/pastJobReports';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const MyWorksPage = () => {
  const teamId = 'HiQkosmUT9FvpXa7';
  const [activeTab, setActiveTab] = useState<'inProgress' | 'past'>('inProgress');

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inProgress' && styles.activeTab]}
          onPress={() => setActiveTab('inProgress')}
        >
          <Text style={[styles.tabText, activeTab === 'inProgress' && styles.activeTabText]}>
            In progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'inProgress' ? (
          <InProgressJobs teamId={teamId} />
        ) : (
          <PastJobReports teamId={teamId} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },

  activeTab: {
    backgroundColor: '#FFFFFF',
  },

  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },

  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default MyWorksPage;
