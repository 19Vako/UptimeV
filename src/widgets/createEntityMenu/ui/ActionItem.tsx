import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ActionItemProps } from '../type';

export function ActionItem({ action, onPress }: ActionItemProps) {
  return (
    <View style={styles.actionRow}>
      <View style={styles.labelBubble}>
        <Text style={styles.label}>{action.label}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Create ${action.label}`}
        onPress={onPress}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: action.color },
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name={action.icon} size={25} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labelBubble: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.14,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    color: '#667085',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 29,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
