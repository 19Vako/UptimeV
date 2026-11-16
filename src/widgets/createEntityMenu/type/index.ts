import { Ionicons } from '@expo/vector-icons';

export type CreateAction = {
  label: 'Client' | 'Job' | 'Request' | 'Quote' | 'Invoice';
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export type ActionItemProps = {
  action: CreateAction;
  onPress: () => void;
};
