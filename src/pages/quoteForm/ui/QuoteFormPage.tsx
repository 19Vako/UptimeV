import { TableNames } from '@/shared/constants/table-names';
import { database, LineItem, Quote } from '@/shared/db';
import { QuoteForm } from '@/widgets/quoteForm';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

export function QuoteFormPage({ id, requestId }: { id?: string; requestId?: string }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;

    void database
      .get<Quote>(TableNames.QUOTES)
      .find(id)
      .then(async (record) => {
        const relatedItems = await record.lineItems.fetch();
        if (!active) return;
        setQuote(record);
        setLineItems(relatedItems);
        setLoading(false);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load quote.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Text style={styles.close}>×</Text>
        </Pressable>
        <Text style={styles.heading}>{id ? 'Edit quote' : 'New quote'}</Text>
        <View style={styles.closePlaceholder} />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.state} color="#16805D" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : id && !quote ? (
        <Text style={styles.error}>Quote not found.</Text>
      ) : (
        <QuoteForm initialRequestId={requestId} submitLabel="Save Quote" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F5' },
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E7E9',
  },
  close: { width: 30, color: '#48545A', fontSize: 30, lineHeight: 34 },
  heading: { color: '#17211F', fontWeight: '700', fontSize: 17 },
  closePlaceholder: { width: 30 },
  state: { flex: 1, marginTop: 32 },
  error: { padding: 24, color: '#B42318', textAlign: 'center' },
});
