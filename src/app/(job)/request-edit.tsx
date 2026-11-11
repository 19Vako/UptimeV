import RequestFormPage from '@/pages/requestForm';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function RequestEditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RequestFormPage id={id} />;
}
