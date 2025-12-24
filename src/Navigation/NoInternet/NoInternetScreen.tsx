import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';
import useStyles from './NoInternetScreenStyles';

const NoInternetScreen = () => {
  const { t } = useTranslation();
  const styles = useStyles();

  return ( 
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/animation/noNetworkAnimation.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.title}>{t('noInternetTitle')}</Text>
      <Text style={styles.subtitle}>{t('noInternetSubtitle')}</Text>
    </View>
  );
};

export default NoInternetScreen;
