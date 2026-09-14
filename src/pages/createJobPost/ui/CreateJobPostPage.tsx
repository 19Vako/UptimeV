import CreateJobPostWidget from '@/widgets/createJobPost';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const CreateJobPostPage = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIcon} accessibilityElementsHidden>
          {'←'}
        </Text>
      </Pressable>
      <CreateJobPostWidget />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    marginTop: 12,
    marginLeft: 16,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    shadowColor: '#172033',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  backIcon: {
    color: '#172033',
    fontSize: 28,
  },
});
