import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  check,
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';
import { Env } from '../config/env';
import { GOOGLE_MAPS_KEY } from '@env';


 
export type Coords = { latitude: number; longitude: number };

const isGranted = (s: PermissionStatus) => s === RESULTS.GRANTED;

/** Check without prompting */
export const isLocationPermissionGranted = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const fine = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    const coarse = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
    return isGranted(fine) || isGranted(coarse);
  } else {
    const whenInUse = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return isGranted(whenInUse);
  }
};

 export const Gooogle_map_Key  = GOOGLE_MAPS_KEY

/** Request when missing (no settings jump here) */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const statuses = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ]);
      const fineOK = isGranted(
        statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
      );
      const coarseOK = isGranted(
        statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION],
      );
      return fineOK || coarseOK;
    } else {
      const res = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return isGranted(res);
    }
  } catch {
    return false;
  }
};

/** Get one fix (no permission checks inside) */
export const getPositionOnce = (): Promise<Coords> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      err => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true, // Android "turn on location" prompt when provider is off
      },
    );
  });

/** Smart helper: checks first; requests only if missing; then gets a fix */
export const getCurrentLocation = async (): Promise<{
  success: boolean;
  coords?: Coords;
  error?: string;
}> => {
  const granted =
    (await isLocationPermissionGranted()) ||
    (await requestLocationPermission());

  if (!granted) return { success: false, error: 'Location permission denied' };

  // short delay helps some OEMs after grant
  await new Promise<void>(r => setTimeout(r, 300));
console.log('location__current_',granted)
  try {
    const coords = await getPositionOnce();
    return { success: true, coords };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unable to get location' };
  }
};

