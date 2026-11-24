import { RequestDetailsWidget } from '@/widgets/requestDetails';
import { RequestDetailsNavBar } from '@/widgets/requestDetails/ui/RequestDetailsNavBar';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function RequestDetailsPage({ id }: { id: string }) {
  return (
    <View style={styles.container}>
      <RequestDetailsNavBar onBack={() => router.back()} />
      <RequestDetailsWidget id={id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F5' },
});
