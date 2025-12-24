import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OrdersScreen from '../Screen/Orders/OrdersScreen';
import OrderDetailsScreen from '../Screen/Orders/OrderDetailsScreen';

export type OrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetails: { orderId: string };
};

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export default function OrdersStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrdersMain" component={OrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
}
