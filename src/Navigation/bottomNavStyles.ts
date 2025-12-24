import { StyleSheet } from 'react-native';
import { useTheme } from '../utils/theme/ThemeProvider';

export type BottomNavColors = {
  active: string;
  inactive: string;
};

export default function useStyles() {
  const { theme } = useTheme();

  const colors: BottomNavColors = {
    active: theme.colors.primary,
    inactive: theme.colors.textSecondary,
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card, // ✅ was surface
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: 8,
    },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    iconWrap: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 24,
    },
    label: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: '600',
    },
    badge: {
      position: 'absolute',
      top: -6,
      right: -12,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.error, // ✅ was danger
      paddingHorizontal: 4,
    },
    badgeLarge: {
      minWidth: 22,
      height: 18,
      borderRadius: 9,
      right: -14,
    },
    badgeText: {
      color: theme.colors.buttonText, // ✅ was white
      fontSize: 10,
      fontWeight: '700',
    },
  });

  return { styles, colors };
}
