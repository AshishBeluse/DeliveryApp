import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import { scaleHeight, scaleWidth } from '../../utils/responsive';

const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    listContainer: {
      paddingVertical: scaleHeight(8),
      paddingHorizontal: scaleWidth(16),
      backgroundColor: theme.colors.background,
    },
    separator: {
      height: scaleHeight(12),
      width: '100%',
    },
  });
};

export default useStyles;
