import JobPostPage from '@/pages/jobPost';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function JobPost() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <JobPostPage id={id} />;
}
