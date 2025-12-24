import type { NavigatorScreenParams } from '@react-navigation/native';

export type OrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetails: { orderId: string };
};

export type BottomTabParamList = {
  Home: undefined;
  Orders: NavigatorScreenParams<OrdersStackParamList>;
  Notifications: undefined;
};

export type AuthStackParamList = {
  GetStartedScreen: undefined;
  LoginWithMobile: undefined;
  NameEmail: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<BottomTabParamList>;
};
