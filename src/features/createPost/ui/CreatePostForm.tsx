import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { createJobPost } from '../model/createJobPost';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customer, setCustomer] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('0');
  const [longitude, setLongitude] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Введите заголовок');
      return;
    }

    setIsSubmitting(true);

    try {
      await createJobPost({
        title: title.trim(),
        description: description.trim(),
        customerId: customerId.trim(),
        customer: customer.trim(),
        location: location.trim(),
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
      });

      Alert.alert('Готово', 'Объявление создано');
      setTitle('');
      setDescription('');
      setCustomerId('');
      setCustomer('');
      setLocation('');
      setLatitude('0');
      setLongitude('0');
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось создать объявление');
      console.warn(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Заголовок</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Заголовок"
      />

      <Text style={styles.label}>Описание</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Описание"
        multiline
      />

      <Text style={styles.label}>Клиент (ID)</Text>
      <TextInput
        style={styles.input}
        value={customerId}
        onChangeText={setCustomerId}
        placeholder="customerId"
      />

      <Text style={styles.label}>Клиент (имя)</Text>
      <TextInput
        style={styles.input}
        value={customer}
        onChangeText={setCustomer}
        placeholder="customer"
      />

      <Text style={styles.label}>Локация</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Адрес или город"
      />

      <Text style={styles.label}>Широта</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        placeholder="0"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Долгота</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        placeholder="0"
        keyboardType="numeric"
      />

      <View style={styles.button}>
        <Button
          title={isSubmitting ? 'Отправка...' : 'Создать объявление'}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </ScrollView>
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
});

export default CreatePostForm;
