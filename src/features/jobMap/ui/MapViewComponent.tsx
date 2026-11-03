import { TASK_TYPE_COLORS } from '@/entities/jobPost';
import type { TaskType } from '@/entities/jobPost/model/type';
import type { JobPost } from '@/shared/db';
import type { UserLocationState } from '@/shared/location';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ClusteredMapView from 'react-native-map-clustering';
import MapView, { Marker } from 'react-native-maps';

type Props = {
  posts: JobPost[];
  userLocation: UserLocationState;
};

type ClusterLeaf = {
  geometry: { coordinates: [number, number] };
  properties: { index: number };
};

const hasValidCoordinates = (post: JobPost) =>
  typeof post.latitude === 'number' &&
  Number.isFinite(post.latitude) &&
  post.latitude >= -90 &&
  post.latitude <= 90 &&
  typeof post.longitude === 'number' &&
  Number.isFinite(post.longitude) &&
  post.longitude >= -180 &&
  post.longitude <= 180;

const isClusterLeaf = (value: unknown): value is ClusterLeaf => {
  if (!value || typeof value !== 'object') return false;
  const feature = value as Partial<ClusterLeaf>;
  return (
    !!feature.geometry &&
    Array.isArray(feature.geometry.coordinates) &&
    feature.geometry.coordinates.length >= 2 &&
    typeof feature.geometry.coordinates[0] === 'number' &&
    typeof feature.geometry.coordinates[1] === 'number' &&
    !!feature.properties &&
    Number.isInteger(feature.properties.index)
  );
};

export function MapViewComponent({ posts, userLocation }: Props) {
  const [selectedPost, setSelectedPost] = useState<JobPost | null>(null);
  const mapRef = useRef<MapView>(null);
  const [selectedCoincidentPosts, setSelectedCoincidentPosts] = useState<JobPost[] | null>(null);
  const mappedPosts = useMemo(() => posts.filter(hasValidCoordinates), [posts]);
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

  const openPost = useCallback((post: JobPost) => {
    router.push({ pathname: '/(job)/jobPost', params: { id: post.id } });
  }, []);

  const handleClusterPress = useCallback(
    (_cluster: unknown, markers?: unknown[]) => {
      const clusterPosts =
        markers
          ?.filter(isClusterLeaf)
          .map(({ properties }) => mappedPosts[properties.index])
          .filter((post): post is JobPost => post !== undefined) ?? [];

      if (clusterPosts.length < 2) return;

      const firstCoordinate = clusterPosts[0];
      const allAtSameCoordinate = clusterPosts.every(
        (post) =>
          post.latitude === firstCoordinate.latitude &&
          post.longitude === firstCoordinate.longitude,
      );

      setSelectedPost(null);
      if (allAtSameCoordinate) {
        setSelectedCoincidentPosts(clusterPosts);
        return;
      }

      setSelectedCoincidentPosts(null);
      mapRef.current?.fitToCoordinates(
        clusterPosts.map((post) => ({ latitude: post.latitude!, longitude: post.longitude! })),
        {
          edgePadding: { top: 72, right: 72, bottom: 180, left: 72 },
          animated: true,
        },
      );
    },
    [mappedPosts],
  );

  const setNativeMapRef = useCallback((ref: React.Ref<MapView>) => {
    if (ref && typeof ref === 'object' && 'fitToCoordinates' in ref) {
      mapRef.current = ref as unknown as MapView;
    }
  }, []);

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
      <ClusteredMapView
        mapRef={setNativeMapRef}
        style={styles.map}
        initialRegion={initialRegion}
        clusterColor="#176A51"
        clusterTextColor="#FFFFFF"
        radius={50}
        maxZoom={20}
        preserveClusterPressBehavior
        onClusterPress={handleClusterPress}
      >
        {mappedPosts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{ latitude: post.latitude!, longitude: post.longitude! }}
            title={post.title}
            description={post.customer}
            pinColor={TASK_TYPE_COLORS[post.taskType as TaskType] ?? TASK_TYPE_COLORS.job_visit}
            onPress={() => setSelectedPost(post)}
          />
        ))}
        {userLocation.location ? (
          <Marker
            {...{ cluster: false }}
            coordinate={{
              latitude: userLocation.location.coords.latitude,
              longitude: userLocation.location.coords.longitude,
            }}
            title="Your location"
            pinColor="#1D4ED8"
          />
        ) : null}
      </ClusteredMapView>
      {selectedPost ? (
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>{selectedPost.title}</Text>
          <Text style={styles.previewDetails}>
            {selectedPost.customer} · {selectedPost.location}
          </Text>
          <Pressable onPress={() => openPost(selectedPost)}>
            <Text style={styles.openLink}>Open job</Text>
          </Pressable>
        </View>
      ) : null}
      {selectedCoincidentPosts ? (
        <View style={styles.preview}>
          <View style={styles.clusterHeader}>
            <Text style={styles.previewTitle}>
              {selectedCoincidentPosts.length} jobs at this location
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close job list"
              onPress={() => setSelectedCoincidentPosts(null)}
            >
              <Text style={styles.openLink}>Close</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.clusterList}>
            {selectedCoincidentPosts.map((post) => (
              <Pressable key={post.id} onPress={() => openPost(post)} style={styles.clusterRow}>
                <Text style={styles.clusterJobTitle} numberOfLines={1}>
                  {post.title || 'Untitled job'}
                </Text>
                <Text style={styles.clusterJobCustomer} numberOfLines={1}>
                  {post.customer}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
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
  clusterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clusterList: { maxHeight: 180, marginTop: 8 },
  clusterRow: {
    paddingVertical: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E4E7EC',
  },
  clusterJobTitle: { color: '#17211F', fontWeight: '700' },
  clusterJobCustomer: { marginTop: 2, color: '#667085', fontSize: 12 },
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
