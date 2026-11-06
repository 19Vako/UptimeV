import JobPostList from '@/widgets/jobPostList';
import { seedDemoJobs } from '@/shared/db/seedDemoJobs';
import { getCurrentLocation } from '@/shared/location';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export const Home = () => {
  const [seeding, setSeeding] = useState(false);

  const addDemoJobs = async () => {
    if (!__DEV__ || seeding) return;
    setSeeding(true);
    try {
      const location = await getCurrentLocation();
      const count = await seedDemoJobs({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      Alert.alert(
        count > 0 ? 'Demo jobs added' : 'Demo jobs already exist',
        count > 0
          ? `${count} sample jobs were added for today. They use fictional customer details and demo map locations.`
          : 'The sample jobs are already in your local database.',
      );
    } catch (error) {
      Alert.alert(
        'Could not add demo jobs',
        error instanceof Error
          ? error.message === 'Location permission was denied'
            ? 'Location permission is required to place demo jobs near you.'
            : error.message
          : 'Unable to get your location or add the demo jobs. Please try again.',
      );
    } finally {
      setSeeding(false);
    }
  };

  return (
    <View style={styles.container}>
      {__DEV__ ? (
        <View style={styles.demoPanel}>
          <View style={styles.demoText}>
            <Text style={styles.demoTitle}>Preview sample data</Text>
            <Text style={styles.demoDescription}>
              Adds example tasks for Schedule, My Works and the map.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={seeding}
            onPress={() => void addDemoJobs()}
            style={({ pressed }) => [styles.demoButton, pressed && styles.pressed]}
          >
            {seeding ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.demoButtonText}>Add demo jobs</Text>
            )}
          </Pressable>
        </View>
      ) : null}
      <JobPostList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  demoPanel: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#E9F0ED',
    gap: 10,
  },
  demoText: { gap: 3 },
  demoTitle: { color: '#17211F', fontWeight: '800', fontSize: 14 },
  demoDescription: { color: '#667085', fontSize: 12 },
  demoButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#16805D',
  },
  demoButtonText: { color: '#FFFFFF', fontWeight: '800' },
  pressed: { opacity: 0.8 },
});
