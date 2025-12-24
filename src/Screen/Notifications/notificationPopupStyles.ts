import { StyleSheet } from 'react-native';
import { normalizeFont, scaleHeight, scaleWidth } from '../../utils/responsive';
import Fonts from '../../utils/fonts';
import { useTheme } from '../../utils/theme/ThemeProvider';

const useStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    wrapper: {
      position: 'absolute',
      top: scaleHeight(16),
      left: scaleWidth(12),
      right: scaleWidth(12),
      zIndex: 9999,
      alignItems: 'center',
    },
    card: {
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      elevation: 10,
      borderWidth: 2,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: scaleWidth(12),
      paddingVertical: scaleHeight(12),
    },
    iconWrap: {
      marginRight: scaleWidth(10),
      marginTop: 2,
    },
    textWrap: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(15),
      marginBottom: scaleHeight(4),
    },
    message: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(13),
    },
    closeBtn: {
      marginLeft: scaleWidth(8),
      padding: scaleWidth(6),
      alignSelf: 'flex-start',
    },

    progressWrap: {
      height: 4,
      width: '100%',
      backgroundColor: '#00000020',
    },
    progress: {
      height: '100%',
    },
  });
};

export default useStyles;
