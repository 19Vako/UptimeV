import { CreatePostForm } from '@/features/createPost';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const CreateJobPostWidget = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create a job post</Text>
      </View>
      <CreatePostForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
    padding: 20,
  },
  header: {
    paddingTop: 8,
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
  },
});
