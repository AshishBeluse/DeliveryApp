import { StyleSheet } from 'react-native';
import { useTheme } from '../../../utils/theme/ThemeProvider';
import Fonts from '../../../utils/fonts';
import { normalizeFont, scaleHeight, scaleWidth } from '../../../utils/responsive';

const useStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: scaleWidth(20), paddingTop: scaleHeight(24) },
    title: { fontFamily: Fonts.GilroyBold, fontSize: normalizeFont(24), color: theme.colors.textPrimary },
    subtitle: { marginTop: scaleHeight(6), fontFamily: Fonts.GilroyRegular, fontSize: normalizeFont(14), color: theme.colors.textSecondary },
  });
};
export default useStyles; 
