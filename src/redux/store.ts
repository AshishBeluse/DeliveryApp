import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import type { Middleware } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { setApiToken } from '../services/http';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'driver', 'orders'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const rehydrateTokenMiddleware: Middleware = _store => next => action => {
  if (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    (action as any).type === REHYDRATE
  ) {
    const token = (action as any)?.payload?.auth?.token;
    if (typeof token === 'string' && token.length > 0) setApiToken(token);
  }
  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(rehydrateTokenMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
