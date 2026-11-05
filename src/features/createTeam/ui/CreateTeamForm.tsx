import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ActionButton, FormField } from '@/shared/ui';
import { createTeam } from '../model/createTeam';
import { FormValues, formSchema } from '../types';

type Props = {
  userId: string;
  onSuccess: () => void;
};

export const CreateTeamForm = ({ userId, onSuccess }: Props) => {
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { teamName: '', membersCount: 1 },
  });

  const submit = async (values: FormValues) => {
    setSubmissionError(null);
    try {
      await createTeam(userId, {
        teamName: values.teamName,
        membersCount: Number(values.membersCount),
      });
      onSuccess();
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : 'Не удалось создать команду. Попробуйте ещё раз.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="teamName"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Название команды"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Например, Северная бригада"
            autoCapitalize="words"
            error={errors.teamName?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="membersCount"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Количество участников"
            value={String(value ?? '')}
            onChangeText={(text) => onChange(text === '' ? undefined : Number(text))}
            onBlur={onBlur}
            placeholder="1"
            keyboardType="number-pad"
            error={errors.membersCount?.message}
          />
        )}
      />
      <Text style={styles.status}>Статус команды будет установлен как «active».</Text>
      {submissionError ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {submissionError}
        </Text>
      ) : null}
      <ActionButton
        title={isSubmitting ? 'Создаём команду…' : 'Создать команду'}
        onPress={handleSubmit(submit)}
        disabled={isSubmitting}
      />
      {isSubmitting ? <ActivityIndicator color="#16805D" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 18 },
  status: { color: '#66736D', fontSize: 13, lineHeight: 18 },
  error: { color: '#B42318', fontSize: 14, lineHeight: 20 },
});

export default CreateTeamForm;
