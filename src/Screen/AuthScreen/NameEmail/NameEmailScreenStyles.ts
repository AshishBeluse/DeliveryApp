import { StyleSheet } from 'react-native';
import Fonts from '../../../utils/fonts';
import {
  normalizeFont,
  scaleHeight,
  scaleWidth,
} from '../../../utils/responsive';
import { useTheme } from '../../../utils/theme/ThemeProvider';

const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },

    headerRow: {
      paddingHorizontal: scaleWidth(16),
      paddingTop: scaleHeight(4),
    },

    backCircle: {
      width: scaleWidth(40),
      height: scaleWidth(40),
      borderRadius: scaleWidth(20),
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(18),
      color: theme.colors.textPrimary,
      marginTop: -2,
    },

    container: {
      paddingHorizontal: scaleWidth(24),
      paddingTop: scaleHeight(8),
    },

    title: {
      fontSize: normalizeFont(20),
      lineHeight: normalizeFont(30),
      fontFamily: Fonts.GilroyBold,
      color: theme.colors.textPrimary,
      marginTop: scaleHeight(10),
      marginBottom: scaleHeight(10),
    },

    inputWrap: {
      height: scaleHeight(54),
      borderRadius: 14,
      backgroundColor: theme.colors.card,
      paddingHorizontal: scaleWidth(16),
      justifyContent: 'center',
      borderWidth: 0,
      borderColor: 'transparent',
    },

    input: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
      color: theme.colors.textPrimary,
      paddingVertical: 0,
    },

    errorText: {
      marginTop: scaleHeight(4),
      color: theme.colors.error ?? '#E53935',
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(11),
      marginBottom: scaleHeight(8),
      marginLeft: scaleWidth(6),
    },

    vehicleRow: {
      flexDirection: 'row',
      gap: scaleWidth(10) as unknown as number,
    },
    vehiclePill: {
      height: scaleHeight(46),
      borderRadius: 14,
      paddingHorizontal: scaleWidth(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    vehiclePillText: {
      fontFamily: Fonts.GilroySemibold,
      fontSize: normalizeFont(13),
    },

    fieldButton: {
      height: scaleHeight(54),
      borderRadius: 14,
      backgroundColor: theme.colors.card,
      paddingHorizontal: scaleWidth(16),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 0,
      borderColor: 'transparent',
    },
    fieldText: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
      color: theme.colors.textPrimary,
    },
    chev: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(18),
      color: theme.colors.textSecondary,
      marginTop: -2,
    },

    ctaPrimary: {
      marginTop: scaleHeight(12),
      height: scaleHeight(52),
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ctaPrimaryText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.buttonText ?? '#000',
    },
  });
};

export default useStyles;
