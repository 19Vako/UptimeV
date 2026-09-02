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
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Create report</Text>
        <Button
          title={isScanning ? 'Scanning...' : 'Scan document'}
          onPress={handleScan}
          disabled={isScanning}
        />
      </View>

      {scanUri ? (
        <View style={styles.scanPreviewBox}>
          <Text style={styles.scanPreviewTitle}>Saved scan</Text>
          <Text style={styles.scanPreviewText}>{scanUri}</Text>
        </View>
      ) : null}

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
  container: {
    gap: 12,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  scanPreviewBox: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f3f4f6',
  },
  scanPreviewTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    color: '#4b5563',
  },
  scanPreviewText: {
    fontSize: 12,
    color: '#1f2937',
  },
});

export default CreateJobReportWidget;
