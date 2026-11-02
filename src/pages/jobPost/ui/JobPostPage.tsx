import { FALLBACK_TEAM_ID } from '@/shared/constants/mock';
import JobPostDetails from '@/widgets/jobPostDetails';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export const JobPostPage = ({ id }: { id: string }) => {
  return (
    <View style={styles.container}>
      <JobPostDetails teamId={FALLBACK_TEAM_ID} postId={id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
});
