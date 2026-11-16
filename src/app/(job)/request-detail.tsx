import RequestDetailsPage from '@/pages/requestDetails';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function RequestDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RequestDetailsPage id={id} />;
}
