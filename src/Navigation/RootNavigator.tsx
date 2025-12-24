import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { bootstrapAuthThunk } from '../redux/authSlice/authSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);

  useEffect(() => {
    dispatch(bootstrapAuthThunk());
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
