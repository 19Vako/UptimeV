import { TASK_TYPE_COLORS } from '@/entities/jobPost';
import type { JobPost } from '@/shared/db';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { UserLocationState } from '@/shared/location';

type Props = {
  posts: JobPost[];
  userLocation: UserLocationState;
};

export function MapViewComponent({ posts, userLocation }: Props) {
  const [selectedPost, setSelectedPost] = useState<JobPost | null>(null);
  const mapRef = useRef<MapView>(null);
  const mappedPosts = useMemo(
    () =>
      posts.filter(
        (post) =>
          typeof post.latitude === 'number' &&
          Number.isFinite(post.latitude) &&
          post.latitude >= -90 &&
          post.latitude <= 90 &&
          typeof post.longitude === 'number' &&
          Number.isFinite(post.longitude) &&
          post.longitude >= -180 &&
          post.longitude <= 180,
      ),
    [posts],
  );
  const firstPost = mappedPosts[0];
  const initialRegion = {
    latitude: userLocation.location?.coords.latitude ?? firstPost?.latitude ?? 0,
    longitude: userLocation.location?.coords.longitude ?? firstPost?.longitude ?? 0,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  };

  useEffect(() => {
    if (userLocation.location) {
      mapRef.current?.animateToRegion(
        {
          latitude: userLocation.location.coords.latitude,
          longitude: userLocation.location.coords.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        },
        500,
      );
    }
  }, [userLocation.location]);

  if (!mappedPosts.length && !userLocation.location) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No mappable jobs</Text>
        <Text style={styles.emptyText}>
          Add coordinates to a job or allow location access to view the map.
        </Text>
        {userLocation.error ? <Text style={styles.error}>{userLocation.error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion}>
        {userLocation.location ? (
          <Marker
            coordinate={{
              latitude: userLocation.location.coords.latitude,
              longitude: userLocation.location.coords.longitude,
            }}
            title="Your location"
            pinColor="#1D4ED8"
          />
        ) : null}
        {mappedPosts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{ latitude: post.latitude!, longitude: post.longitude! }}
            title={post.title}
            description={post.customer}
            pinColor={TASK_TYPE_COLORS[post.taskType] ?? TASK_TYPE_COLORS.job_visit}
            onPress={() => setSelectedPost(post)}
          />
        ))}
      </MapView>
      {selectedPost ? (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>{selectedPost.title}</Text>
          <Text style={styles.previewDetails}>
            {selectedPost.customer} · {selectedPost.location}
          </Text>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/(job)/jobPost', params: { id: selectedPost.id } })
            }
          >
            <Text style={styles.openLink}>Open job</Text>
          </Pressable>
        </View>
      ) : null}
      {userLocation.permission === 'denied' ? (
        <Text style={styles.notice}>Location access denied. Showing job locations.</Text>
      ) : null}
      {userLocation.error ? <Text style={styles.error}>{userLocation.error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 300 },
  map: { flex: 1 },
  empty: { flex: 1, minHeight: 300, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { color: '#17211F', fontSize: 18, fontWeight: '700' },
  emptyText: { marginTop: 8, color: '#6B7280', textAlign: 'center' },
  preview: {
    position: 'absolute',
    bottom: 18,
    left: 16,
    right: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 4,
  },
  previewTitle: { color: '#17211F', fontSize: 16, fontWeight: '700' },
  previewDetails: { marginTop: 4, color: '#6B7280' },
  openLink: { marginTop: 10, color: '#16805D', fontWeight: '700' },
  notice: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#6B7280',
  },
  error: { padding: 8, color: '#B42318', backgroundColor: '#fff' },
});
