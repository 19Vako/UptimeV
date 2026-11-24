import { QuoteFormPage } from '@/pages/quoteForm';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function QuoteCreateRoute() {
  const { requestId } = useLocalSearchParams<{ requestId?: string }>();
  return <QuoteFormPage requestId={requestId} />;
}
