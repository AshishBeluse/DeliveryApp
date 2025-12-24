import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import { normalizeFont, scaleHeight, scaleWidth } from '../../utils/responsive';
import Fonts from '../../utils/fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useStyles = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    container: {
      paddingBottom: scaleHeight(54),
      backgroundColor: theme.colors.background,
    },

    header: {
      paddingHorizontal: scaleWidth(16),
      paddingVertical: scaleHeight(12),
      borderBottomWidth: 1,
    },
    headerTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(18),
      textAlign: 'center',
      color: theme.colors.textPrimary,
    },
    headerSubtitle: {
      marginTop: scaleHeight(4),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(12),
      textAlign: 'center',
      color: theme.colors.textSecondary,
    },

    section: {
      paddingTop: scaleHeight(12),
    },

    offlineWrap: {
      paddingVertical: scaleHeight(24),
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: scaleWidth(16),
    },
    offlineTitle: {
      marginTop: scaleHeight(12),
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.textSecondary,
    },
    offlineSubtitle: {
      marginTop: scaleHeight(6),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
      color: theme.colors.textSecondary,
      textAlign: 'center',
      maxWidth: scaleWidth(280),
    },

    availableHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleHeight(12),
      paddingHorizontal: scaleWidth(16),
    },
    availableTitle: {
      marginLeft: scaleWidth(8),
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.textPrimary,
    },
    countBadge: {
      marginLeft: scaleWidth(8),
      paddingHorizontal: scaleWidth(8),
      paddingVertical: scaleHeight(4),
      borderRadius: 999,
    },
    countText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(12),
    },

    emptyWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: scaleHeight(24),
      paddingHorizontal: scaleWidth(16),
    },
    emptyText: {
      marginTop: scaleHeight(12),
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(15),
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    emptySub: {
      marginTop: scaleHeight(6),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });
};

export default useStyles;
