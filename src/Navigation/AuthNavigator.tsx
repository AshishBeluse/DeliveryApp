import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AuthStackParamList } from './types';
import GetStartedScreen from '../Screen/GetStartedScreen/GetStartedScreen';
import LoginWithMobileScreen from '../Screen/AuthScreen/LoginWithMobile/LoginWithMobileScreen';
// import NameEmailScreen from '../Screen/AuthScreen/NameEmail/NameEmail';
import NameEmailScreen from '../Screen/AuthScreen/NameEmail/NameEmailScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="GetStartedScreen"
    >
      <Stack.Screen name="GetStartedScreen" component={GetStartedScreen} />
      <Stack.Screen name="LoginWithMobile" component={LoginWithMobileScreen} />
      <Stack.Screen name="NameEmail" component={NameEmailScreen} />
    </Stack.Navigator>
  );
}
