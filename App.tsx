import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';

import { store, persistor } from './src/redux/store';
import RootNavigator from './src/Navigation/RootNavigator';
import { ThemeProvider } from './src/utils/theme/ThemeProvider';
import { LocationProvider } from './src/utils/LocationContext';
import { DriverTrackingProvider } from './src/utils/DriverTrackingProvider';

import {
  ensurePushPermission,
  getFcmTokenSafe,
  listenForegroundMessages,
  handleInitialNotification,
  listenNotificationOpen,
  listenTokenRefresh,
} from './src/utils/pushNotifications';

export default function App() {
  useEffect(() => {
    (async () => {
      await ensurePushPermission();

      const token = await getFcmTokenSafe();
      console.log(' FCM TOKEN:', token);

      // Foreground receive
      const unsubMsg = listenForegroundMessages(msg => {
        console.log(' FOREGROUND MSG:', msg);
        // If you want banner while open: use Notifee here
      });

      // Opened from killed
      await handleInitialNotification(msg => {
        console.log(' OPENED FROM KILLED:', msg);
      });

      // Opened from background
      const unsubOpen = listenNotificationOpen(msg => {
        console.log(' OPENED FROM BACKGROUND:', msg);
      });

      // Token refresh
      const unsubToken = listenTokenRefresh(newToken => {
        console.log(' TOKEN REFRESHED:', newToken);
        // save + send to backend again
      });

      return () => {
        unsubMsg();
        unsubOpen();
        unsubToken();
      };
    })();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <LocationProvider>
            <DriverTrackingProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </DriverTrackingProvider>
          </LocationProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
