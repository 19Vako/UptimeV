import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type Props = { onBack: () => void };

export function RequestDetailsNavBar({ onBack }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to requests"
        onPress={onBack}
        hitSlop={8}
      >
        <Text style={styles.back}>‹</Text>
      </Pressable>
      <Text style={styles.heading}>Request</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Call client"
        onPress={() =>
          Alert.alert(
            'Call client',
            'Calling will be available when customer contact details are supported.',
          )
        }
        style={({ pressed }) => [styles.callButton, pressed && styles.pressed]}
      >
        <Ionicons name="call-outline" size={24} color="#16805D" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E7E9',
  },
  back: { width: 30, color: '#48545A', fontSize: 34, lineHeight: 36 },
  heading: { color: '#17211F', fontWeight: '700', fontSize: 17 },
  placeholder: { width: 30 },
  callButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E8F2EE',
  },
  callLabel: { color: '#174D3E', fontSize: 15, fontWeight: '700' },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  actionButton: { flex: 1, minWidth: 0 },
  pressed: { opacity: 0.75 },
});
