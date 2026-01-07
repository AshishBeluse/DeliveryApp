import { Platform } from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

/**
 * iOS: requests notification permission
 * Android: on Android 13+, request POST_NOTIFICATIONS runtime permission handled by firebase messaging internally,
 * but you should still call requestPermission() for consistency.
 */
export async function ensurePushPermission(): Promise<boolean> {
  try {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } catch {
    return false;
  }
}

/**
 * Ensures device is registered and returns FCM token.
 * This works on both Android + iOS (once firebase native setup is correct).
 */
export async function getFcmTokenSafe(): Promise<string | null> {
  try {
    const enabled = await ensurePushPermission(); // ✅ add this
    if (!enabled) return null;

    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    return token || null;
  } catch {
    return null;
  }
}

/**
 * Foreground listener (app open).
 * iOS will NOT automatically show banner in foreground — you’ll get the message here.
 */
export function listenForegroundMessages(
  onMsg: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  return messaging().onMessage(async remoteMessage => {
    onMsg(remoteMessage);
  });
}

/**
 * When app is opened from background by tapping notification.
 */
export function listenNotificationOpen(
  onOpen: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  return messaging().onNotificationOpenedApp(remoteMessage => {
    onOpen(remoteMessage);
  });
}

/**
 * When app is opened from killed/terminated state by tapping notification.
 */
export async function handleInitialNotification(
  onOpen: (msg: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  const initial = await messaging().getInitialNotification();
  if (initial) onOpen(initial);
}

/**
 * Token refresh listener (FCM token can change).
 * Save it and send to backend when changed.
 */
export function listenTokenRefresh(onToken: (token: string) => void) {
  return messaging().onTokenRefresh(token => {
    onToken(token);
  });
}
