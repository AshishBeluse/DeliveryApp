import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../utils/theme/ThemeProvider';
import type { AuthStackParamList } from '../../Navigation/types';
import useStyles from './getStartedStyles';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'GetStartedScreen'>;

const GetStartedScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useStyles();
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <View style={styles.container}>
        {/* Banner / Lottie */}
        <View style={styles.bannerWrap}>
          <LottieView
            source={require('../../assets/animation/Fooddelivered.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        {/* Text */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>Get started!</Text>
          <Text style={styles.subtitle}>Everything starts from here!</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsBlock}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('LoginWithMobile')}
          >
            <Text style={styles.primaryText}>Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('NameEmail')}
          >
            <Text style={styles.secondaryText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GetStartedScreen;
