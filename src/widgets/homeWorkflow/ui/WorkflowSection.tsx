import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { WorkflowSectionProps } from '../type';
import { Item } from './Item';

export function WorkflowSection({ title, color, icon, groups }: WorkflowSectionProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  return (
    <View style={styles.section}>
      <View style={[styles.marker, { backgroundColor: color }]}>
        <Ionicons name={icon} size={27} color="#FFFFFF" />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <FlatList
          data={groups}
          keyExtractor={(group) => group.key}
          renderItem={({ item: group, index }) => {
            const canExpand = group.items.length > 0;
            const expanded = expandedGroup === group.key;
            return (
              <View style={[styles.group, index < groups.length - 1 && styles.groupDivider]}>
                <Pressable
                  accessibilityRole={canExpand ? 'button' : undefined}
                  accessibilityState={canExpand ? { expanded } : undefined}
                  disabled={!canExpand}
                  onPress={() => setExpandedGroup(expanded ? null : group.key)}
                  style={({ pressed }) => [styles.groupButton, pressed && styles.pressed]}
                >
                  <Text style={[styles.count, !canExpand && styles.muted]}>
                    {group.items.length}
                  </Text>
                  <View style={styles.groupCopy}>
                    <Text style={[styles.groupTitle, !canExpand && styles.muted]}>
                      {group.label}
                    </Text>
                    {canExpand ? (
                      <Text style={styles.groupSubtitle}>
                        {group.items.length === 1 ? '1 record' : `${group.items.length} records`}
                      </Text>
                    ) : null}
                  </View>
                  {canExpand ? (
                    <Ionicons
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#AAB0B5"
                    />
                  ) : null}
                </Pressable>
                {expanded ? group.items.map((item) => <Item key={item.id} item={item} />) : null}
              </View>
            );
          }}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { flexDirection: 'row', alignItems: 'stretch', gap: 16 },
  marker: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  body: { flex: 1, minWidth: 0, paddingBottom: 8 },
  title: { marginBottom: 8, color: '#17211F', fontSize: 20, fontWeight: '800' },
  group: { paddingVertical: 5 },
  groupDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#D9DDE0' },
  groupButton: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 6,
  },
  count: { width: 22, paddingTop: 1, color: '#17211F', fontSize: 16, textAlign: 'right' },
  groupCopy: { flex: 1, gap: 2 },
  groupTitle: { color: '#17211F', fontSize: 16, fontWeight: '500', lineHeight: 22 },
  groupSubtitle: { color: '#7C858D', fontSize: 14, lineHeight: 19 },
  muted: { color: '#A0A7AD' },
  pressed: { opacity: 0.65 },
});
