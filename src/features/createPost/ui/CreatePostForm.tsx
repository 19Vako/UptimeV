import React, { useState } from 'react';
import { Button, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createJobPost } from '../model/createJobPost';

const CreatePostForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    title: '',
    message: '',
  });
  const [form, setForm] = useState({
    title: '',
    description: '',
    customerId: '',
    customer: '',
    location: '',
    latitude: 0,
    longitude: 0,
  });

  const showNotification = (title: string, message: string) => {
    setNotification({ visible: true, title, message });
  };

  const handleSubmit = async () => {
    if (!form.title) {
      showNotification('Error', 'Please enter a title');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };

      await createJobPost(payload);

      showNotification('Done', 'Post created');
      setForm({
        title: '',
        description: '',
        customerId: '',
        customer: '',
        location: '',
        latitude: 0,
        longitude: 0,
      });
    } catch (err) {
      showNotification('Error', 'Failed to create post');
      console.warn(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoordinateChange = (field: 'latitude' | 'longitude', value: string) => {
    const parsedValue = value === '' ? 0 : Number(value);
    const nextValue = Number.isNaN(parsedValue) ? 0 : parsedValue;
    setForm((prev) => ({ ...prev, [field]: nextValue }));
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={form.title}
          onChangeText={(text) => handleChange('title', text)}
          placeholder="Title"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Description"
          multiline
        />

        <Text style={styles.label}>Customer (ID)</Text>
        <TextInput
          style={styles.input}
          value={form.customerId}
          onChangeText={(text) => handleChange('customerId', text)}
          placeholder="customerId"
        />

        <Text style={styles.label}>Customer (name)</Text>
        <TextInput
          style={styles.input}
          value={form.customer}
          onChangeText={(text) => handleChange('customer', text)}
          placeholder="customer"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={form.location}
          onChangeText={(text) => handleChange('location', text)}
          placeholder="Address or city"
        />

        <Text style={styles.label}>Latitude</Text>
        <TextInput
          style={styles.input}
          value={form.latitude.toString()}
          onChangeText={(text) => handleCoordinateChange('latitude', text)}
          placeholder="0"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Longitude</Text>
        <TextInput
          style={styles.input}
          value={form.longitude.toString()}
          onChangeText={(text) => handleCoordinateChange('longitude', text)}
          placeholder="0"
          keyboardType="numeric"
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
