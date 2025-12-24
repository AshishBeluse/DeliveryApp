import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../utils/theme/ThemeProvider';
import Fonts from '../../utils/fonts';
import { normalizeFont, scaleHeight, scaleWidth } from '../../utils/responsive';

const useStyles = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },

    container: {
      flex: 1,
      paddingHorizontal: scaleWidth(18),
    },

    bannerWrap: {
      marginTop: scaleHeight(16),
      height: '42%',
      borderRadius: 12,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.background,
    },

    lottie: {
      width: '80%',
      height: '90%',
    },

    textBlock: {
      alignItems: 'center',
      marginTop: scaleHeight(28),
    },

    title: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(22),
      color: theme.colors.textPrimary,
    },

    subtitle: {
      marginTop: scaleHeight(6),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
      color: theme.colors.textSecondary,
    },

    buttonsBlock: {
      marginTop: scaleHeight(32),
      gap: scaleHeight(12) as unknown as number,
    },

    primaryBtn: {
      height: scaleHeight(48),
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    primaryText: {
      fontFamily: Fonts.GilroySemibold,
      fontSize: normalizeFont(16),
      color: theme.colors.buttonText ?? '#000',
    },

    secondaryBtn: {
      height: scaleHeight(48),
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },

    secondaryText: {
      fontFamily: Fonts.GilroySemibold,
      fontSize: normalizeFont(16),
      color: theme.colors.primary,
    },
  });
};

export default useStyles;
