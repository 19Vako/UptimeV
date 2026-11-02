import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TASK_TYPE_LABELS, type TaskType } from '@/entities/jobPost';
import { editPost } from '../model/editPost';
import { EditPostFormProps, EditPostFormValues, editPostSchema } from '../types';
import FormInput from './FormInput';

const toLocalDateTimeInput = (timestamp?: number) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

const EditPostForm = ({ post }: EditPostFormProps) => {
  const [notification, setNotification] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      id: post.id,
      title: post.title,
      description: post.description,
      status: post.status,
      customer: post.customer,
      location: post.location,
      taskType: post.taskType ?? 'job_visit',
      customerPhone: post.customerPhone ?? '',
      scheduledStartTime: toLocalDateTimeInput(post.scheduledStartTime),
      scheduledEndTime: toLocalDateTimeInput(post.scheduledEndTime),
    },
  });

  const showNotification = (title: string, message: string) => {
    setNotification({ visible: true, title, message });
  };

  const onSubmit = async (data: EditPostFormValues) => {
    try {
      await editPost(data);
      showNotification('Success', 'Post updated successfully');
      reset(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
      showNotification('Error', errorMessage);
      console.error('Edit post error:', error);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormInput title="Title" name="title" control={control} placeholder="Title" />

        <FormInput
          title="Description"
          name="description"
          control={control}
          placeholder="Description"
          multiline
        />

        <FormInput title="Status" name="status" control={control} placeholder="open" />

        <FormInput
          title="Customer (name)"
          name="customer"
          control={control}
          placeholder="Customer"
        />

        <FormInput
          title="Location"
          name="location"
          control={control}
          placeholder="Address or city"
        />
        <Text style={styles.label}>Task type</Text>
        <View style={styles.taskTypes}>
          {(Object.keys(TASK_TYPE_LABELS) as TaskType[]).map((taskType) => (
            <TouchableOpacity
              key={taskType}
              onPress={() => setValue('taskType', taskType, { shouldValidate: true })}
              style={[
                styles.taskTypeButton,
                watch('taskType') === taskType && styles.selectedTaskType,
              ]}
            >
              <Text style={styles.taskTypeText}>{TASK_TYPE_LABELS[taskType]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FormInput
          title="Customer phone (optional)"
          name="customerPhone"
          control={control}
          placeholder="+1 555 123 4567"
        />
        <FormInput
          title="Scheduled start (optional)"
          name="scheduledStartTime"
          control={control}
          placeholder="2026-10-30T09:00"
        />
        <FormInput
          title="Scheduled end (optional)"
          name="scheduledEndTime"
          control={control}
          placeholder="2026-10-30T10:00"
        />

        <View style={styles.button}>
          <Button
            title={isSubmitting ? 'Saving...' : 'Update post'}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={notification.visible}
        animationType="fade"
        onRequestClose={() => setNotification((prev) => ({ ...prev, visible: false }))}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{notification.title}</Text>
            <Text style={styles.modalMessage}>{notification.message}</Text>
            <View style={styles.modalButton}>
              <Button
                title="OK"
                onPress={() => setNotification((prev) => ({ ...prev, visible: false }))}
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
  inputContainer: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 6, color: '#111' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  inputError: { borderColor: 'red' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
  button: { marginTop: 8 },
  taskTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  taskTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D5DED9',
    backgroundColor: '#fff',
  },
  selectedTaskType: { borderColor: '#16805D', backgroundColor: '#E0F2EC' },
  taskTypeText: { color: '#34413D', fontSize: 13, fontWeight: '600' },
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

export default EditPostForm;
