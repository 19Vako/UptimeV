import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { createTeam } from '../model/createTeam';
import { FormValues, formSchema } from '../types';

export const CreateTeamForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [notification, setNotification] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: '',
      membersCount: 1,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await createTeam({
        teamName: data.teamName,
        membersCount: Number(data.membersCount),
      });

      reset();
      setNotification({
        visible: true,
        title: 'Success',
        message: 'Team created successfully',
      });
      onSuccess?.();
    } catch (error) {
      setNotification({
        visible: true,
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create team',
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Controller
          control={control}
          name="teamName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Team Name</Text>
              <TextInput
                style={[styles.input, errors.teamName && styles.errorInput]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Enter team name"
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
              <Text style={styles.label}>Members Count</Text>
              <TextInput
                style={[styles.input, errors.membersCount && styles.errorInput]}
                value={value ? String(value) : ''}
                onChangeText={(text) => onChange(Number(text))}
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
            title={isSubmitting ? 'Creating...' : 'Create team'}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
        </View>
      </View>

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

export default CreateTeamForm;
