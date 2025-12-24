import { StyleSheet } from 'react-native';
import { useTheme } from '../../../utils/theme/ThemeProvider';
import Fonts from '../../../utils/fonts';
import { normalizeFont, scaleHeight, scaleWidth } from '../../../utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useStyles = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background, paddingTop: insets.top },
    container: { flex: 1, paddingHorizontal: scaleWidth(20), paddingTop: scaleHeight(24) },
    title: { fontFamily: Fonts.GilroyBold, fontSize: normalizeFont(24), color: theme.colors.textPrimary },
    subtitle: { marginTop: scaleHeight(6), fontFamily: Fonts.GilroyRegular, fontSize: normalizeFont(14), color: theme.colors.textSecondary },
    input: { 
      marginTop: scaleHeight(18),
      borderWidth: 1,
      borderColor: theme.colors.border ?? theme.colors.inputBorder,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      paddingHorizontal: scaleWidth(14),
      paddingVertical: scaleHeight(12),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
      color: theme.colors.textPrimary,
    },
    btn: { marginTop: scaleHeight(18) },
  });
};
export default useStyles;
