import React, { useCallback, useState } from 'react';
import { Button, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createJobPost } from '../model/createJobPost';
import { CreatePostArgs, CreatePostFormFields } from '../types';
import FormInput from './FormInput';

const CreatePostForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const [form, setForm] = useState<CreatePostArgs>({
    title: '',
    description: '',
    customerId: '0000',
    customer: '',
    location: '',
    latitude: 0,
    longitude: 0,
  });

  const showNotification = (title: string, message: string) => {
    setNotification({ visible: true, title, message });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createJobPost(form);
      showNotification('Done', 'Post created');
    } catch {
      showNotification('Error', 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = useCallback((field: CreatePostFormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormInput
          title="Title"
          field="title"
          handleChange={handleChange}
          value={form.title}
          placeholder="Title"
        />

        <FormInput
          title="Description"
          field="description"
          handleChange={handleChange}
          value={form.description}
          placeholder="Description"
          multiline
        />

        <FormInput
          title="Customer (name)"
          field="customer"
          handleChange={handleChange}
          value={form.customer}
          placeholder="customer"
        />

        <FormInput
          title="Location"
          field="location"
          handleChange={handleChange}
          value={form.location}
          placeholder="Address or city"
        />

        <View style={styles.button}>
          <Button
            title={isSubmitting ? 'Submitting...' : 'Create post'}
            onPress={handleSubmit}
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
  container: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 8,
  },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111',
  },
  modalMessage: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
  },
  modalButton: {
    alignSelf: 'flex-end',
  },
});

export default CreatePostForm;
