import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../Screen/Home/HomeScreen';
// import OrdersScreen from '../Screen/Orders/OrdersScreen';

import NotificationsScreen from '../Screen/Notifications/NotificationsScreen';
import BottomNav, { ScreenKey } from './BottomNav';
import OrdersStackNavigator from './OrdersStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

export type BottomTabParamList = {
  Home: undefined;
  Orders: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  // If unread count / notifications are in redux, pull from there.
  // Keeping as 0 to avoid prop drilling (you can wire later).
  const unreadCount = 0;

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={navProps => {
        const current = navProps.state.routes[navProps.state.index]
          .name as ScreenKey;
        return (
          <BottomNav
            currentScreen={current}
            onNavigate={screen => navProps.navigation.navigate(screen)}
            unreadCount={unreadCount}
          />
        );
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* <Tab.Screen name="Orders" component={OrdersScreen} /> */}
      <Tab.Screen name="Orders" component={OrdersStackNavigator} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
