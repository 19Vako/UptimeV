import { BackFromSignatureButton } from '@/features/backFromSignature';
import { ClearSignatureButton } from '@/features/clearSignature';
import { ConfirmQuoteSignatureButton } from '@/features/confirmSignature';
import { TableNames } from '@/shared/constants/table-names';
import { database, Quote } from '@/shared/db';
import { SignaturePad, type SignaturePadHandle } from '@/shared/ui';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

type Props = { quoteId: string };

export function QuoteSignatureWidget({ quoteId }: Props) {
  const signaturePad = useRef<SignaturePadHandle>(null);
  const [quoteTitle, setQuoteTitle] = useState<string | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(quoteId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quoteId) return;
    let active = true;

    void database
      .get<Quote>(TableNames.QUOTES)
      .find(quoteId)
      .then((quote) => {
        if (!active) return;
        setQuoteTitle(quote.title);
        setLoading(false);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Quote not found.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [quoteId]);

  if (!quoteId) {
    return <Text style={styles.error}>A valid quote ID is required to capture a signature.</Text>;
  }
  if (loading) return <ActivityIndicator style={styles.loading} color="#16805D" />;
  if (error || !quoteTitle) {
    return <Text style={styles.error}>{error ?? 'Quote not found.'}</Text>;
  }

  const clearSignature = () => {
    signaturePad.current?.clear();
    setHasSignature(false);
  };
  const readSignature = () => {
    if (!signaturePad.current) {
      return Promise.reject(new Error('Signature pad is not ready.'));
    }
    return signaturePad.current.read();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackFromSignatureButton disabled={saving} />
        <Text style={styles.headerTitle}>Client signature</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.quoteTitle}>{quoteTitle}</Text>
        <Text style={styles.instruction}>Ask the client to sign below.</Text>
        <View style={styles.padContainer}>
          <SignaturePad
            ref={signaturePad}
            onSignatureChange={setHasSignature}
            onError={(padError) =>
              Alert.alert(
                'Signature pad error',
                padError.message || 'Could not read the signature.',
              )
            }
          />
          {saving ? <View pointerEvents="auto" style={styles.savingOverlay} /> : null}
        </View>
        <View style={styles.actions}>
          <View style={styles.action}>
            <ClearSignatureButton onClear={clearSignature} disabled={saving} />
          </View>
          <View style={styles.action}>
            <ConfirmQuoteSignatureButton
              quoteId={quoteId}
              getSignature={readSignature}
              disabled={!hasSignature || saving}
              onConfirmed={() => router.back()}
              onBusyChange={setSaving}
            />
          </View>
        </View>
      </View>
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
  headerTitle: { color: '#17211F', fontWeight: '700', fontSize: 17 },
  headerPlaceholder: { width: 52 },
  content: { flex: 1, padding: 18, gap: 12 },
  quoteTitle: { color: '#17211F', fontSize: 20, fontWeight: '700' },
  instruction: { color: '#667085', fontSize: 15 },
  padContainer: { position: 'relative' },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF22',
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  action: { flex: 1, minWidth: 0 },
  loading: { flex: 1, marginTop: 32 },
  error: { padding: 24, color: '#B42318', textAlign: 'center' },
});
