import type { NavigatorScreenParams } from '@react-navigation/native';

export type OrdersStackParamList = {
  OrdersMain: undefined;
  OrderDetails: { orderId: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  ChangePassword: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Orders: NavigatorScreenParams<OrdersStackParamList>;
  Notifications: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
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
