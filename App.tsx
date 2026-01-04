import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';

import { store, persistor } from './src/redux/store';
import RootNavigator from './src/Navigation/RootNavigator';
import { ThemeProvider } from './src/utils/theme/ThemeProvider';
import { LocationProvider } from './src/utils/LocationContext';
import { DriverTrackingProvider } from './src/utils/DriverTrackingProvider';

export default function App() {
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
