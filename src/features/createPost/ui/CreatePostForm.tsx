import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createJobPost } from '../model/createJobPost';
import { CreatePostFormValues, createPostSchema } from '../types';
import FormInput from './FormInput';

const CreatePostForm = () => {
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
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      description: '',
      customerId: '0000',
      customer: '',
      location: '',
      latitude: 0,
      longitude: 0,
    },
  });

  const showNotification = (title: string, message: string) => {
    setNotification({ visible: true, title, message });
  };

  const onSubmit = async (data: CreatePostFormValues) => {
    try {
      await createJobPost(data);
      showNotification('Success', 'Post created successfully');
      reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      showNotification('Error', errorMessage);
      console.error('Create post error:', error);
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

        <View style={styles.button}>
          <Button
            title={isSubmitting ? 'Submitting...' : 'Create post'}
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

// ... стили остаются без изменений (modalOverlay, modalCard и т.д.)
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

export default CreatePostForm;
