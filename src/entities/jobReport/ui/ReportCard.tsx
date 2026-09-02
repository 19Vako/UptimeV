import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { JobReportCardProps } from '../model/type';

export default function ReportCard({ jobReport }: JobReportCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          Job report
        </Text>
        <Text style={styles.jobId} numberOfLines={1}>
          Job: {jobReport.job_id}
        </Text>
      </View>

      {jobReport.description ? (
        <Text style={styles.description} numberOfLines={3}>
          {jobReport.description}
        </Text>
      ) : null}

      <View style={styles.row}>
        <Text style={styles.label}>Arrival:</Text>
        <Text style={styles.value}>{jobReport.arrival_at.toLocaleString()}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Started:</Text>
        <Text style={styles.value}>{jobReport.started_at.toLocaleString()}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Finished:</Text>
        <Text style={styles.value}>{jobReport.finished_at.toLocaleString()}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Signature: {jobReport.customer_signature_uri ? 'Attached' : 'Missing'}
        </Text>
        <Text style={styles.footerText}>
          Document: {jobReport.document_scan_uri ? 'Attached' : 'Missing'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginRight: 10,
  },
  jobId: {
    maxWidth: '45%',
    fontSize: 12,
    color: '#6B7280',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    width: 70,
    marginRight: 6,
    fontSize: 13,
    color: '#6B7280',
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  description: {
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 6,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: '#9CA3AF',
  },
});
