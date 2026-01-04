import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Fonts from '../../utils/fonts';
import { normalizeFont, scaleHeight, scaleWidth } from '../../utils/responsive';

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scaleWidth(16),
      paddingTop: scaleHeight(8),
      paddingBottom: scaleHeight(12),
    },
    backBtn: {
      width: scaleWidth(40),
      height: scaleWidth(40),
      borderRadius: scaleWidth(20),
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.textPrimary,
    },

    form: { paddingHorizontal: scaleWidth(16) },

    label: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(13),
      color: theme.colors.textPrimary,
      marginTop: scaleHeight(10),
      marginBottom: scaleHeight(8),
    },
    inputWrap: {
      height: scaleHeight(54),
      borderRadius: 14,
      backgroundColor: theme.colors.card,
      paddingHorizontal: scaleWidth(16),
      justifyContent: 'center',
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
      marginBottom: scaleHeight(4),
      marginLeft: scaleWidth(6),
    },

    saveBtn: {
      marginTop: scaleHeight(14),
      height: scaleHeight(52),
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    },
    saveText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(15),
    },
  });
}
