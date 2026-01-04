import { StyleSheet } from 'react-native';
import Fonts from '../../utils/fonts';
import { normalizeFont, scaleHeight, scaleWidth } from '../../utils/responsive';
import { useTheme } from '../../utils/theme/ThemeProvider';

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderRadius: 12,
      padding: scaleWidth(14),
    },

    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: scaleHeight(10),
    },

    restaurantName: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.primary,
    },

    customerName: {
      marginTop: scaleHeight(4),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
      color: theme.colors.textSecondary,
    },

    amount: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.primary,
    },

    distanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: scaleHeight(4),
    },

    distance: {
      marginLeft: scaleWidth(6),
      fontSize: normalizeFont(12),
      color: theme.colors.textSecondary,
    },

    itemsBox: {
      borderWidth: 1,
      borderRadius: 10,
      padding: scaleWidth(10),
      marginBottom: scaleHeight(10),
      backgroundColor: theme.colors.card,
    },

    itemsLabel: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(12),
      color: theme.colors.textSecondary,
      marginBottom: scaleHeight(6),
    },

    itemText: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
      color: theme.colors.textPrimary,
      marginBottom: scaleHeight(2),
    },

    infoSection: {
      marginBottom: scaleHeight(14),
    },

    infoRow: {
      // flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: scaleHeight(10),
    },
    topLine: {
      flexDirection: 'row',
      alignItems: 'center', // ✅ locks icon + text baseline
      gap: scaleWidth(8), // ✅ RN 0.71+ (otherwise use marginLeft)
      marginBottom: scaleHeight(6),
    },
    infoTextBlock: {
      paddingLeft: scaleWidth(26),
      // 18 (icon) + 8 (gap) = perfect alignment under link text
    },
    mapsLinkText: {
      textDecorationLine: 'underline',
      fontSize: normalizeFont(14),
      fontFamily: Fonts.GilroyRegular,
    },
    infoLabel: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(12),
      color: theme.colors.textSecondary,
    },

    infoText: {
      marginTop: scaleHeight(2),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
      color: theme.colors.textPrimary,
    },

    acceptButton: {
      height: scaleHeight(44),
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    },

    acceptText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(14),
    },
  });
}
