import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

type Props = {
  title: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  groups: WorkflowStatusGroup[];
};

export function WorkflowSection({ title, color, icon, groups }: Props) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  return (
    <View style={styles.section}>
      <View style={[styles.marker, { backgroundColor: color }]}>
        <Ionicons name={icon} size={27} color="#FFFFFF" />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {groups.map((group, index) => {
          const canExpand = group.items.length > 0;
          const expanded = expandedGroup === group.key;
          return (
            <View
              key={group.key}
              style={[styles.group, index < groups.length - 1 && styles.groupDivider]}
            >
              <Pressable
                accessibilityRole={canExpand ? 'button' : undefined}
                accessibilityState={canExpand ? { expanded } : undefined}
                disabled={!canExpand}
                onPress={() => setExpandedGroup(expanded ? null : group.key)}
                style={({ pressed }) => [styles.groupButton, pressed && styles.pressed]}
              >
                <Text style={[styles.count, !canExpand && styles.muted]}>{group.items.length}</Text>
                <View style={styles.groupCopy}>
                  <Text style={[styles.groupTitle, !canExpand && styles.muted]}>{group.label}</Text>
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
              {expanded
                ? group.items.map((item) => {
                    const row = (
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
                        key={item.id}
                        accessibilityRole="button"
                        onPress={item.onPress}
                        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
                      >
                        {row}
                        <Ionicons name="chevron-forward" size={18} color="#AAB0B5" />
                      </Pressable>
                    ) : (
                      <View key={item.id} style={styles.item}>
                        {row}
                      </View>
                    );
                  })
                : null}
            </View>
          );
        })}
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
