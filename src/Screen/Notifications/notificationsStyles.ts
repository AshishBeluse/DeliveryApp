import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Fonts from '../../utils/fonts';
import { normalizeFont, scaleHeight, scaleWidth } from '../../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useStyles = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
      //  paddingTop: insets.top
    },
    header: {
      paddingHorizontal: scaleWidth(16),
      paddingTop: scaleHeight(10),
      paddingBottom: scaleHeight(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border ?? theme.colors.inputBorder,
      backgroundColor: theme.colors.card,
    },
    title: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(18),
      color: theme.colors.textPrimary,
    },
    subtitle: {
      marginTop: 2,
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(12),
      color: theme.colors.textSecondary,
    },
    markAllBtn: {
      paddingHorizontal: scaleWidth(10),
      paddingVertical: scaleHeight(8),
    },
    markAllText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(12),
      color: theme.colors.primary,
    },

    list: { padding: scaleWidth(16), paddingBottom: scaleHeight(32) },

    card: {
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border ?? theme.colors.inputBorder,
      borderRadius: 12,
      padding: scaleWidth(12),
      marginBottom: scaleHeight(10),
    },
    cardUnread: {
      borderColor: theme.colors.primary,
    },
    cardRow: { flexDirection: 'row' },
    iconWrap: {
      width: scaleWidth(34),
      height: scaleWidth(34),
      borderRadius: scaleWidth(17),
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scaleWidth(10),
    },
    textWrap: { flex: 1 },
    cardTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(14),
      color: theme.colors.textPrimary,
    },
    cardMsg: {
      marginTop: 2,
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
      color: theme.colors.textSecondary,
    },
    cardTime: {
      marginTop: 6,
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(11),
      color: theme.colors.textSecondary,
    },
  });
};

export default useStyles;
