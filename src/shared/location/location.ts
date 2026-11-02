import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export type UserLocationState = {
  location: Location.LocationObject | null;
  loading: boolean;
  permission: 'unknown' | 'granted' | 'denied';
  error: string | null;
};

const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const getCurrentLocation = async (): Promise<Location.LocationObject> => {
  const granted = await requestLocationPermission();
  if (!granted) {
    throw new Error('Location permission was denied');
  }
  return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
};

export const useUserLocation = (): UserLocationState => {
  const [state, setState] = useState<UserLocationState>({
    location: null,
    loading: true,
    permission: 'unknown',
    error: null,
  });

  useEffect(() => {
    let active = true;
    let subscription: Location.LocationSubscription | undefined;

    const startWatching = async () => {
      try {
        const granted = await requestLocationPermission();
        if (!active) return;

        if (!granted) {
          setState({ location: null, loading: false, permission: 'denied', error: null });
          return;
        }

        setState((previous) => ({ ...previous, permission: 'granted', error: null }));
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 20,
            timeInterval: 10000,
          },
          (location) => {
            if (active) {
              setState({ location, loading: false, permission: 'granted', error: null });
            }
          },
        );

        if (active) {
          setState((previous) => ({ ...previous, loading: false }));
        } else {
          subscription.remove();
        }
      } catch (locationError) {
        if (active) {
          setState({
            location: null,
            loading: false,
            permission: 'unknown',
            error:
              locationError instanceof Error ? locationError.message : 'Unable to read location',
          });
        }
      }
    };

    void startWatching();
    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  return state;
};
