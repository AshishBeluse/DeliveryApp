import { StyleSheet } from 'react-native';
import { scaleHeight, scaleWidth } from '../../utils/responsive';

export default function useStyles() {
  return StyleSheet.create({
    listContainer: {
      padding: scaleWidth(16),
    },
    separator: {
      height: scaleHeight(16),
    },
  });
}




