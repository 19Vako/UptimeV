import { ActionButton } from '@/shared/ui';
import React from 'react';

type Props = { onClear: () => void; disabled?: boolean };

export function ClearSignatureButton({ onClear, disabled = false }: Props) {
  return <ActionButton title="Clear" secondary disabled={disabled} onPress={onClear} />;
}
