import { ActionButton } from '@/shared/ui';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { confirmQuoteSignature } from '../model/confirmQuoteSignature';

type Props = {
  quoteId: string;
  getSignature: () => Promise<string>;
  disabled?: boolean;
  onConfirmed: () => void;
  onBusyChange: (busy: boolean) => void;
};

export function ConfirmQuoteSignatureButton({
  quoteId,
  getSignature,
  disabled = false,
  onConfirmed,
  onBusyChange,
}: Props) {
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    onBusyChange(true);
    let confirmed = false;
    try {
      const signature = await getSignature();
      await confirmQuoteSignature(quoteId, signature);
      confirmed = true;
    } catch (error: unknown) {
      Alert.alert(
        'Could not save signature',
        error instanceof Error ? error.message : 'An unexpected error occurred.',
      );
    } finally {
      setSaving(false);
      onBusyChange(false);
    }
    if (confirmed) onConfirmed();
  };

  return (
    <ActionButton
      title={saving ? 'Saving…' : 'Confirm'}
      disabled={disabled || saving}
      onPress={() => void handleConfirm()}
    />
  );
}
