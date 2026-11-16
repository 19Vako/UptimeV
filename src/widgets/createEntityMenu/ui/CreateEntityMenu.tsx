import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { CREATE_ACTIONS } from '../constants/actions';
import type { CreateAction } from '../type';
import { ActionItem } from './ActionItem';

export function CreateEntityMenu() {
  const [expanded, setExpanded] = useState(false);

  const selectAction = (action: CreateAction) => {
    setExpanded(false);
    switch (action.label) {
      case 'Client':
      case 'Quote':
      case 'Invoice':
        showComingSoon(action.label);
        break;
      case 'Job':
        router.push('/(job)/createJobPost');
        break;
      case 'Request':
        router.push('/(job)/request-create');
        break;
    }
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
        {expanded ? (
          <FlatList
            data={CREATE_ACTIONS}
            keyExtractor={(action) => action.label}
            renderItem={({ item }) => (
              <ActionItem action={item} onPress={() => selectAction(item)} />
            )}
            contentContainerStyle={styles.actionList}
            scrollEnabled={false}
          />
        ) : null}
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

function showComingSoon(entity: 'Client' | 'Quote' | 'Invoice') {
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
  actionList: { gap: 12 },
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
});
