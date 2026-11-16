import { RequestDetailsWidget } from '@/widgets/requestDetails';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function RequestDetailsPage({ id }: { id: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to requests"
          onPress={() => router.back()}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.heading}>Request Details</Text>
        <View style={styles.placeholder} />
      </View>
      <RequestDetailsWidget id={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F5' },
  header: {
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
});
