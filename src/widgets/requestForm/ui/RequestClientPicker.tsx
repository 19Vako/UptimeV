import { TableNames } from '@/shared/constants/table-names';
import { database, JobPost } from '@/shared/db';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ClientOption = { id: string; name: string };

type Props = {
  value?: string;
  onChange: (clientId?: string) => void;
};

export function RequestClientPicker({ value, onChange }: Props) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const subscription = database
      .get<JobPost>(TableNames.JOBPOSTS)
      .query()
      .observe()
      .subscribe({
        next: (records) => {
          setJobs(records);
          setLoading(false);
          setError(null);
        },
        error: (observationError: unknown) => {
          setError(
            observationError instanceof Error
              ? observationError.message
              : 'Unable to load clients.',
          );
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, []);

  const clients = useMemo(() => {
    const byId = new Map<string, ClientOption>();
    for (const job of jobs) {
      const id = job.customerId?.trim();
      const name = job.customer?.trim();
      if (id && id !== '0000' && name && !byId.has(id)) byId.set(id, { id, name });
    }
    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [jobs]);

  const selectedClient = clients.find((client) => client.id === value);

  return (
    <>
      <View style={styles.group}>
        <Text style={styles.label}>For</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setVisible(true)}
          style={({ pressed }) => [styles.selector, pressed && styles.pressed]}
        >
          <Text style={styles.personIcon}>♙</Text>
          <Text style={styles.selectedName}>
            {selectedClient?.name ?? 'Select a client (optional)'}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        {loading ? <ActivityIndicator size="small" color="#16805D" /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && !error && clients.length === 0 ? (
          <Text style={styles.hint}>
            No existing clients are available. You can save the request without one.
          </Text>
        ) : null}
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select client</Text>
              <Pressable accessibilityRole="button" onPress={() => setVisible(false)}>
                <Text style={styles.close}>Close</Text>
              </Pressable>
            </View>
            <FlatList
              data={clients}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={styles.hint}>Clients from existing jobs will appear here.</Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    onChange(item.id);
                    setVisible(false);
                  }}
                  style={styles.option}
                >
                  <Text style={styles.optionName}>{item.name}</Text>
                  <Text style={styles.optionId}>{item.id}</Text>
                </Pressable>
              )}
            />
            {value ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  onChange(undefined);
                  setVisible(false);
                }}
                style={styles.clearButton}
              >
                <Text style={styles.clearText}>Remove client</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8, paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF' },
  label: { color: '#818B94', fontSize: 14 },
  selector: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E3E5',
  },
  personIcon: { color: '#818B94', fontSize: 24 },
  selectedName: { flex: 1, color: '#17211F', fontSize: 16, fontWeight: '600' },
  chevron: { color: '#8DBA19', fontSize: 26 },
  hint: { color: '#77818A', fontSize: 13, lineHeight: 19, paddingVertical: 8 },
  error: { color: '#B42318', fontSize: 13 },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000066' },
  modal: {
    maxHeight: '75%',
    minHeight: '35%',
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 16 },
  modalTitle: { color: '#17211F', fontSize: 18, fontWeight: '700' },
  close: { color: '#16805D', fontWeight: '700' },
  option: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EAECED' },
  optionName: { color: '#17211F', fontSize: 16, fontWeight: '600' },
  optionId: { color: '#77818A', fontSize: 12, marginTop: 3 },
  clearButton: { alignItems: 'center', paddingVertical: 14 },
  clearText: { color: '#B42318', fontWeight: '700' },
  pressed: { opacity: 0.75 },
});
