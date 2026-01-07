/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  // You can store it, update badge, etc.
  // console.log('BG message:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
