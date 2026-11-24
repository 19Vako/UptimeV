import { QuoteSignatureWidget } from '@/widgets/quoteSignature';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function QuoteSignatureRoute() {
  const { quoteId } = useLocalSearchParams<{ quoteId?: string | string[] }>();
  const validQuoteId = typeof quoteId === 'string' ? quoteId.trim() : '';

  return <QuoteSignatureWidget quoteId={validQuoteId} />;
}
