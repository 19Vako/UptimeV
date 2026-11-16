import { RequestListWidget } from '@/widgets/requestList';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function RequestsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Requests</Text>
      </View>
      <RequestListWidget />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F5' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: '#FFFFFF' },
  title: { color: '#17211F', fontSize: 24, fontWeight: '800' },
});
