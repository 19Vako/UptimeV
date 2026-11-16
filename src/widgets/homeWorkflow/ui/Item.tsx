import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { WorkflowItemProps } from '../type';

export function Item({ item }: WorkflowItemProps) {
  const content = (
    <View style={styles.itemCopy}>
      <Text style={styles.itemTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {item.detail ? (
        <Text style={styles.itemDetail} numberOfLines={2}>
          {item.detail}
        </Text>
      ) : null}
    </View>
  );

  return item.onPress ? (
    <Pressable
      accessibilityRole="button"
      onPress={item.onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      {content}
      <Ionicons name="chevron-forward" size={18} color="#AAB0B5" />
    </Pressable>
  ) : (
    <View style={styles.item}>{content}</View>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingLeft: 36,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8EAEC',
  },
  itemCopy: { flex: 1, gap: 2 },
  itemTitle: { color: '#26332F', fontSize: 14, fontWeight: '600' },
  itemDetail: { color: '#77818A', fontSize: 12, lineHeight: 17 },
  pressed: { opacity: 0.65 },
});
