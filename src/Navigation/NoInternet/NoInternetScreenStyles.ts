import { StyleSheet } from 'react-native';
import { scaleWidth, scaleHeight, normalizeFont } from '../../utils/responsive';
import Fonts from '../../utils/fonts';
import { useTheme } from '../../utils/theme/ThemeProvider';

const useStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      paddingHorizontal: scaleWidth(24),
    },
    lottie: { 
      width: scaleWidth(200),
      height: scaleHeight(200),
      marginBottom: scaleHeight(24),
    },
    title: {
      fontSize: normalizeFont(20),
      fontFamily: Fonts.GilroySemibold,
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: scaleHeight(8),
    },
    subtitle: {
      fontSize: normalizeFont(14),
      fontFamily: Fonts.GilroyRegular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });
};

export default useStyles;

