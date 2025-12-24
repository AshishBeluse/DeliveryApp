import { StyleSheet } from 'react-native';
import {
  normalizeFont,
  scaleHeight,
  scaleWidth,
} from '../../../utils/responsive';
import { useTheme } from '../../../utils/theme/ThemeProvider';
import Fonts from '../../../utils/fonts';

const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    container: {
      flex: 1,
      paddingHorizontal: scaleWidth(24),
      paddingTop: scaleHeight(8),
    },

    title: {
      fontSize: normalizeFont(20),
      lineHeight: normalizeFont(30),
      fontFamily: Fonts.GilroyBold,
      color: theme.colors.textPrimary,
      marginTop: scaleHeight(6),
      marginBottom: scaleHeight(14),
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaleWidth(12) as unknown as number,
    },
    phoneWrap: {
      flex: 1,
      height: scaleHeight(54),
      borderRadius: 12,
      backgroundColor: theme.colors.card,
      overflow: 'hidden',
      borderWidth: 0,
      borderColor: 'transparent',
    },

    passwordWrap: {
      flex: 1,
      height: scaleHeight(54),
      borderRadius: 12,
      backgroundColor: theme.colors.card,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scaleWidth(14),
      overflow: 'hidden',
    },
    flagBtn: {
      height: scaleHeight(54),
      borderRadius: 12,
      backgroundColor: theme.colors.card,
      paddingHorizontal: scaleWidth(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 0,
    },

    inputWrap: {
      flex: 1,
      height: scaleHeight(54),
      borderRadius: 12,
      backgroundColor: theme.colors.card,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scaleWidth(14),
      overflow: 'hidden',
    },

    codePrefix: {
      fontFamily: Fonts.GilroySemibold,
      fontSize: normalizeFont(14),
      color: theme.colors.textPrimary,
      marginRight: scaleWidth(4),
    },

    input: {
      flex: 1,
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
      color: theme.colors.textPrimary,
    },

    errorText: {
      marginTop: scaleHeight(4),
      color: theme.colors.error,
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(11),
      marginBottom: scaleHeight(6),
      marginLeft: scaleWidth(6),
    },

    ctaPrimary: {
      marginTop: scaleHeight(8),
      height: scaleHeight(52),
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    ctaPrimaryText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.buttonText ?? '#000',
    },

    eyeBtn: {
      position: 'absolute',
      right: 12,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      padding: 4,
    },

    // optional helper for the register link text
    linkFontFamily: { fontFamily: Fonts.GilroySemibold },
  });
};

export default useStyles;
