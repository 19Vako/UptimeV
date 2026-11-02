import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TASK_TYPE_LABELS, type TaskType } from '@/entities/jobPost';
import { getCurrentLocation } from '@/shared/location';
import { createJobPost } from '../model/createJobPost';
import { CreatePostFormValues, createPostSchema } from '../types';
import FormInput from './FormInput';

const CreatePostForm = () => {
  const [isLocating, setIsLocating] = useState(false);
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
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      description: '',
      customerId: '0000',
      customer: '',
      location: '',
      taskType: 'job_visit',
      customerPhone: '',
      scheduledStartTime: '',
      scheduledEndTime: '',
      latitude: undefined,
      longitude: undefined,
    },
  });

  const showNotification = (title: string, message: string) => {
    setNotification({ visible: true, title, message });
  };

  const onSubmit = async (data: CreatePostFormValues) => {
    try {
      await createJobPost({
        ...data,
        customerPhone: data.customerPhone || undefined,
        scheduledStartTime: data.scheduledStartTime
          ? Date.parse(data.scheduledStartTime)
          : undefined,
        scheduledEndTime: data.scheduledEndTime ? Date.parse(data.scheduledEndTime) : undefined,
      });
      showNotification('Success', 'Post created successfully');
      reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      showNotification('Error', errorMessage);
      console.error('Create post error:', error);
    }
  };

  const captureLocation = async () => {
    setIsLocating(true);
    try {
      const location = await getCurrentLocation();
      setValue('latitude', location.coords.latitude, { shouldValidate: true });
      setValue('longitude', location.coords.longitude, { shouldValidate: true });
      showNotification('Location saved', 'Current coordinates were added to this job.');
    } catch (locationError) {
      showNotification(
        'Location unavailable',
        locationError instanceof Error ? locationError.message : 'Unable to get device location',
      );
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormInput title="Title" name="title" control={control} placeholder="Title" />

        <FormInput
          title="Description"
          name="description"
          control={control}
          placeholder="Description"
          multiline
        />

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
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.locationButton, pressed && styles.buttonPressed]}
          onPress={() => void captureLocation()}
          disabled={isLocating}
        >
          <Text style={styles.locationButtonText}>
            {isLocating ? 'Getting location…' : 'Use current location for map'}
          </Text>
        </Pressable>
        <Text style={styles.sectionLabel}>Task type</Text>
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
              <Text
                style={[
                  styles.taskTypeText,
                  watch('taskType') === taskType && styles.selectedTaskTypeText,
                ]}
              >
                {TASK_TYPE_LABELS[taskType]}
              </Text>
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
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Create post</Text>
          )}
        </Pressable>
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
            <Pressable
              style={({ pressed }) => [styles.modalButton, pressed && styles.buttonPressed]}
              onPress={() => setNotification((prev) => ({ ...prev, visible: false }))}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 24,
  },
  sectionLabel: {
    marginBottom: 8,
    color: '#71807C',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  locationButton: {
    alignSelf: 'flex-start',
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#E0F2EC',
  },
  locationButtonText: { color: '#176A51', fontWeight: '700', fontSize: 13 },
  taskTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  taskTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D5DED9',
    backgroundColor: '#FFFFFF',
  },
  selectedTaskType: {
    borderColor: '#16805D',
    backgroundColor: '#E0F2EC',
  },
  taskTypeText: {
    color: '#34413D',
    fontSize: 13,
    fontWeight: '600',
  },
  selectedTaskTypeText: {
    color: '#176A51',
  },
  button: {
    marginTop: 'auto',
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 33, 31, 0.38)',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    color: '#17211F',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalMessage: {
    color: '#34413D',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    minWidth: 72,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#16805D',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default CreatePostForm;
