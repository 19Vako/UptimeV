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
  View,
} from 'react-native';
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
