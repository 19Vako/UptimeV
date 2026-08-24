import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createJobReport } from '../model/createJobReport';
import { CreateReportFormValues, createReportSchema } from '../types';
import FormInput from './FormInput';

type CreateReportFormProps = {
  jobId: string;
  onCreated?: () => void;
};

const CreateReportForm = ({ jobId, onCreated }: CreateReportFormProps) => {
  const [notification, setNotification] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      description: '',
      arrivalAt: '',
      startedAt: '',
      finishedAt: '',
      customerSignatureUri: '',
      documentScanUri: '',
    },
  });

  const onSubmit = async (data: CreateReportFormValues) => {
    try {
      await createJobReport({
        jobId,
        description: data.description,
        arrivalAt: new Date(data.arrivalAt),
        startedAt: new Date(data.startedAt),
        finishedAt: new Date(data.finishedAt),
        customerSignatureUri: data.customerSignatureUri || undefined,
        documentScanUri: data.documentScanUri || undefined,
      });
      setNotification({
        visible: true,
        title: 'Success',
        message: 'Report created successfully',
      });
      reset();
      onCreated?.();
    } catch (error) {
      setNotification({
        visible: true,
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create report',
      });
      console.error('Create report error:', error);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormInput
          title="Description"
          name="description"
          control={control}
          placeholder="Describe completed work"
          multiline
        />
        <FormInput
          title="Arrival time"
          name="arrivalAt"
          control={control}
          placeholder="2026-08-24T09:00"
        />
        <FormInput
          title="Start time"
          name="startedAt"
          control={control}
          placeholder="2026-08-24T09:30"
        />
        <FormInput
          title="Finish time"
          name="finishedAt"
          control={control}
          placeholder="2026-08-24T17:00"
        />
        <FormInput
          title="Customer signature URI"
          name="customerSignatureUri"
          control={control}
          placeholder="Optional file URI"
        />
        <FormInput
          title="Document scan URI"
          name="documentScanUri"
          control={control}
          placeholder="Optional file URI"
        />
        <View style={styles.button}>
          <Button
            title={isSubmitting ? 'Creating...' : 'Create report'}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={notification.visible}
        animationType="fade"
        onRequestClose={() => setNotification((previous) => ({ ...previous, visible: false }))}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{notification.title}</Text>
            <Text style={styles.modalMessage}>{notification.message}</Text>
            <View style={styles.modalButton}>
              <Button
                title="OK"
                onPress={() => setNotification((previous) => ({ ...previous, visible: false }))}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  button: { marginTop: 8 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#111' },
  modalMessage: { fontSize: 14, color: '#444', marginBottom: 16 },
  modalButton: { alignSelf: 'flex-end' },
});

export default CreateReportForm;
