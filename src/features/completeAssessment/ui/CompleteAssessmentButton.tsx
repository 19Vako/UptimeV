import { ActionButton } from '@/shared/ui';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { completeAssessment } from '../model/completeAssessment';

type Props = { requestId: string; disabled?: boolean };

export function CompleteAssessmentButton({ requestId, disabled = false }: Props) {
  const [completing, setCompleting] = useState(false);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await completeAssessment(requestId);
      router.replace('/(job)/(tabs)/home');
    } catch (error: unknown) {
      Alert.alert(
        'Could not complete assessment',
        error instanceof Error ? error.message : 'An unexpected database error occurred.',
      );
    } finally {
      setCompleting(false);
    }
  };

  return (
    <ActionButton
      title={completing ? 'Completing…' : 'Complete Assessment'}
      disabled={disabled || completing}
      onPress={() => void handleComplete()}
    />
  );
}
