import { CreateReportForm } from '@/features/createJobReport';
import { scanDocument } from '@/features/scanDocument';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export const CreateJobReportWidget = ({ id }: { id: string }) => {
  const [scanUri, setScanUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    const result = await scanDocument();
    setScanUri(result);
    setIsScanning(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Create report</Text>
        </View>
      </View>

      <View style={styles.scanBox}>
        <Button
          title={isScanning ? 'Scanning...' : 'Scan document'}
          onPress={handleScan}
          disabled={isScanning}
        />
        {scanUri ? (
          <View style={styles.scanPreviewBox}>
            <Text style={styles.scanPreviewTitle}>Saved scan</Text>
            <Text style={styles.scanPreviewText}>{scanUri}</Text>
          </View>
        ) : (
          <View style={styles.emptyStateBox}>
            <Text style={styles.emptyStateText}>No scan added yet</Text>
          </View>
        )}
      </View>

      <CreateReportForm
        jobId={id}
        documentScanUri={scanUri ?? ''}
        onCreated={() => {
          setScanUri(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  scanBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  scanPreviewBox: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
    marginBottom: 12,
  },
  scanPreviewTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    color: '#4338ca',
  },
  scanPreviewText: {
    fontSize: 12,
    color: '#1f2937',
  },
  emptyStateBox: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default CreateJobReportWidget;
