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
      // paddingTop: insets.top,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: scaleWidth(16),
      paddingTop: scaleHeight(6),
      paddingBottom: scaleHeight(8),
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarWrap: {
      width: scaleWidth(64),
      height: scaleWidth(64),
      borderRadius: scaleWidth(32),
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTextWrap: {
      marginLeft: scaleWidth(8),
    },
    headerTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(18),
      color: theme.colors.textPrimary,
      textAlign: 'left',
    },
    driverId: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
      color: theme.colors.textSecondary,
      marginTop: scaleHeight(4),
    },

    container: {
      paddingBottom: scaleHeight(54),
      backgroundColor: theme.colors.background,
    },

    /* Online card */
    onlineCard: {
      borderWidth: 2,
      borderRadius: 12,
      padding: scaleWidth(12),
      marginHorizontal: scaleWidth(16),
      marginTop: scaleHeight(12),
      marginBottom: scaleHeight(12),
    },
    onlineRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    onlineLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    onlineDot: {
      width: scaleWidth(10),
      height: scaleWidth(10),
      borderRadius: scaleWidth(10) / 2,
      marginRight: scaleWidth(8),
    },
    onlineTexts: {
      marginLeft: scaleWidth(4),
    },
    onlineTitleActive: {
      fontFamily: Fonts.GilroyBold,
      color: theme.colors.primary,
      fontSize: normalizeFont(14),
    },
    onlineTitleInactive: {
      fontFamily: Fonts.GilroyBold,
      color: theme.colors.textSecondary,
      fontSize: normalizeFont(14),
    },
    onlineSubtitle: {
      fontFamily: Fonts.GilroyRegular,
      color: theme.colors.textSecondary,
      fontSize: normalizeFont(11),
    },

    section: {
      paddingHorizontal: scaleWidth(16),
      paddingTop: scaleHeight(16),
      paddingBottom: scaleHeight(8),
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleHeight(12),
    },
    sectionTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.textPrimary,
      marginLeft: scaleWidth(8),
    },

    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: scaleWidth(12) as unknown as number,
      marginBottom: scaleHeight(12),
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border ?? theme.colors.inputBorder,
      borderRadius: 12,
      padding: scaleWidth(12),
      marginRight: scaleWidth(8),
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleHeight(8),
    },
    statLabel: {
      marginLeft: scaleWidth(8),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(12),
      color: theme.colors.textSecondary,
    },
    earningsText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(22),
      color: theme.colors.primary,
      marginTop: scaleHeight(4),
    },
    smallMuted: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(11),
      color: theme.colors.textSecondary,
      marginTop: scaleHeight(4),
    },
    bigWhite: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.textPrimary,
      marginTop: scaleHeight(4),
    },

    activeCard: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: scaleWidth(12),
      marginBottom: scaleHeight(12),
    },
    activeTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(13),
      color: theme.colors.buttonText || '#000',
      marginLeft: scaleWidth(8),
    },
    activeText: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
      color: theme.colors.buttonText || '#000',
      marginTop: scaleHeight(6),
    },
    activeSub: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(11),
      color: theme.colors.buttonText
        ? `${theme.colors.buttonText}CC`
        : '#00000080',
      marginTop: scaleHeight(4),
    },

    noActiveCard: {
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border ?? theme.colors.inputBorder,
      borderRadius: 12,
      padding: scaleWidth(12),
      marginBottom: scaleHeight(12),
    },
    noActiveTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(13),
      color: theme.colors.textSecondary,
      marginLeft: scaleWidth(8),
    },
    noActiveText: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
      color: theme.colors.textSecondary,
      marginTop: scaleHeight(6),
    },

    subSectionTitle: {
      marginTop: scaleHeight(4),
      marginBottom: scaleHeight(8),
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(15),
      color: theme.colors.textPrimary,
    },
    quickList: {
      marginBottom: scaleHeight(12),
    },
    quickItem: {
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border ?? theme.colors.inputBorder,
      borderRadius: 12,
      padding: scaleWidth(12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: scaleHeight(10),
    },
    earningsSmall: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(14),
      color: theme.colors.primary,
    },
    badgeText: {
      fontFamily: Fonts.GilroyBold,
      color: theme.colors.primary,
      fontSize: normalizeFont(12),
    },

    ctaWrap: {
      marginTop: scaleHeight(12),
    },
    ctaBtn: {
      backgroundColor: theme.colors.primary,
      paddingVertical: scaleHeight(16),
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    ctaText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(15),
      color: theme.colors.buttonText || '#000',
    },
  });
};

export default useStyles;
