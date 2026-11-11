import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

type CreateAction = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};

export function CreateEntityMenu() {
  const [expanded, setExpanded] = useState(false);

  const actions: CreateAction[] = [
    {
      label: 'Client',
      icon: 'person-add-outline',
      color: '#55BFAF',
      onPress: () => showComingSoon('Client'),
    },
    {
      label: 'Job',
      icon: 'hammer-outline',
      color: '#A8C916',
      onPress: () => router.push('/(job)/createJobPost'),
    },
    {
      label: 'Request',
      icon: 'file-tray-full-outline',
      color: '#526BCB',
      onPress: () => router.push('/(job)/request-create'),
    },
    {
      label: 'Quote',
      icon: 'document-text-outline',
      color: '#C45A9B',
      onPress: () => showComingSoon('Quote'),
    },
    {
      label: 'Invoice',
      icon: 'receipt-outline',
      color: '#7963B5',
      onPress: () => showComingSoon('Invoice'),
    },
  ];

  const selectAction = (action: CreateAction) => {
    setExpanded(false);
    action.onPress();
  };

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {expanded ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close create menu"
          onPress={() => setExpanded(false)}
          style={styles.dismissArea}
        />
      ) : null}
      <View style={styles.controls}>
        {expanded
          ? actions.map((action) => (
              <View key={action.label} style={styles.actionRow}>
                <View style={styles.labelBubble}>
                  <Text style={styles.label}>{action.label}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Create ${action.label}`}
                  onPress={() => selectAction(action)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: action.color },
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name={action.icon} size={25} color="#FFFFFF" />
                </Pressable>
              </View>
            ))
          : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Close create menu' : 'Create'}
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((value) => !value)}
          style={({ pressed }) => [styles.mainButton, pressed && styles.mainPressed]}
        >
          <Ionicons name={expanded ? 'close' : 'add'} size={34} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function showComingSoon(entity: 'Client' | 'JobPost' | 'Quote' | 'Invoice') {
  Alert.alert(`${entity} creation`, `${entity} creation will be available soon.`);
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  dismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'flex-end',
    gap: 12,
  },
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
  mainButton: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 31,
    backgroundColor: '#16805D',
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 7,
  },
  mainPressed: {
    opacity: 0.8,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
