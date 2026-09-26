import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { createTeam } from '../model/createTeam';
import { FormValues, formSchema } from '../types';

export const CreateTeamForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: '',
      membersCount: '1',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createTeam({
        teamName: data.teamName,
        membersCount: Number(data.membersCount),
      });

      reset();
      Alert.alert('Успех', 'Команда успешно создана');
      onSuccess?.();
    } catch (error) {
      Alert.alert('Ошибка', error instanceof Error ? error.message : 'Не удалось создать команду');
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="teamName"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Название команды</Text>
            <TextInput
              style={[styles.input, errors.teamName && styles.errorInput]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Введите название"
              autoCapitalize="none"
            />
            {errors.teamName && <Text style={styles.errorText}>{errors.teamName.message}</Text>}
          </View>
        )}
      />

      <Controller
        control={control}
        name="membersCount"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Количество участников</Text>
            <TextInput
              style={[styles.input, errors.membersCount && styles.errorInput]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="1"
              keyboardType="numeric"
            />
            {errors.membersCount && (
              <Text style={styles.errorText}>{errors.membersCount.message}</Text>
            )}
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isSubmitting ? 'Создание...' : 'Создать'}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 8,
  },
});

export default CreateTeamForm;
