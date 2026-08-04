import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { sync } from './synchronize';

export const useSyncTriggers = () => {
  useEffect(() => {
    sync().catch(console.error);

    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        sync().catch(console.error);
      }
    });

    const netInfoSubscription = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        sync().catch(console.error);
      }
    });

    return () => {
      appStateSubscription.remove();
      netInfoSubscription();
    };
  }, []);
};
