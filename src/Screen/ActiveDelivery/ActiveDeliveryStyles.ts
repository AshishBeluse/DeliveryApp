import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import { normalizeFont, scaleHeight, scaleWidth } from '../../utils/responsive';
import Fonts from '../../utils/fonts';

const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderWidth: 2,
      borderRadius: 12,
      padding: scaleWidth(12),
      marginBottom: scaleHeight(12),
    },

    successCard: {
      borderRadius: 12,
      padding: scaleWidth(20),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: scaleHeight(12),
    },
    successTitle: {
      marginTop: scaleHeight(12),
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
    },
    successSub: {
      marginTop: scaleHeight(6),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
    },

    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: scaleHeight(8),
    },
    statusTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
    },
    statusBadge: {
      paddingHorizontal: scaleWidth(10),
      paddingVertical: scaleHeight(6),
      borderRadius: 999,
      width: '48%',
    },
    statusBadgeText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(12),
      textAlign: 'center',
    },

    infoCard: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border ?? theme.colors.inputBorder,
      borderRadius: 12,
      padding: scaleWidth(12),
      marginBottom: scaleHeight(12),
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: scaleHeight(8),
    },
    smallMuted: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(11),
      color: theme.colors.textSecondary,
    },
    linkText: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(11),
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    infoValue: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(14),
      color: theme.colors.textPrimary,
      marginTop: scaleHeight(4),
    },
    divider: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border ?? theme.colors.inputBorder,
      marginVertical: scaleHeight(8),
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: scaleHeight(6),
    },
    rowStart: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    mt8: { marginTop: scaleHeight(12) },

    outlineBtn: {
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: scaleHeight(10),
      paddingHorizontal: scaleWidth(12),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    outlineBtnText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
    },

    itemsList: {
      marginTop: scaleHeight(4),
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: scaleHeight(4),
    },
    bullet: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(14),
      marginRight: scaleWidth(8),
    },
    itemText: {
      flex: 1,
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
      color: theme.colors.textPrimary,
    },

    actionBtn: {
      borderRadius: 12,
      paddingVertical: scaleHeight(14),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    actionBtnText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.buttonText || '#000',
    },
    iconLeft: {
      marginRight: scaleWidth(8),
    },
  });
};

export default useStyles;
