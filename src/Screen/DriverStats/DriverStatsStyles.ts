import { StyleSheet } from 'react-native';
import { normalizeFont, scaleWidth, scaleHeight } from '../../utils/responsive';
import Fonts from '../../utils/fonts';
import { useTheme } from '../../utils/theme/ThemeProvider';

const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: scaleWidth(14),
      justifyContent: 'space-between',
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    card: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderRadius: 12,
      borderColor: theme.colors.border,
      padding: scaleWidth(10),
      marginHorizontal: scaleWidth(4),
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleHeight(4),
      gap: scaleWidth(6),
    },

    label: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(11),
      color: theme.colors.textSecondary,
    },

    value: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
      color: theme.colors.textPrimary,
    },

    valueGreen: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(16),
    },
  });
};

export default useStyles;
