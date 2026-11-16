import type { Ionicons } from '@expo/vector-icons';

export type WorkflowItem = {
  id: string;
  title: string;
  detail?: string;
  onPress?: () => void;
};

export type WorkflowStatusGroup = {
  key: string;
  label: string;
  items: WorkflowItem[];
};

export type WorkflowSectionProps = {
  title: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  groups: WorkflowStatusGroup[];
};

export type WorkflowItemProps = {
  item: WorkflowItem;
};
