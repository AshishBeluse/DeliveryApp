import { StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Fonts from '../../utils/fonts';
import { normalizeFont, scaleHeight, scaleWidth } from '../../utils/responsive';

export default function useStyles() {
  const { theme } = useTheme();

  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },

    // ✅ makes screen scroll and keeps Save button visible above bottom tab
    scrollContent: {
      paddingBottom: scaleHeight(140),
    },

    header: {
      paddingHorizontal: scaleWidth(16),
      paddingTop: scaleHeight(8),
      paddingBottom: scaleHeight(12),
    },
    headerTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(18),
      color: theme.colors.textPrimary,
    },

    photoSection: {
      alignItems: 'center',
      paddingVertical: scaleHeight(10),
    },
    photoWrap: {
      width: scaleWidth(92),
      height: scaleWidth(92),
      borderRadius: scaleWidth(46),
      position: 'relative',
    },
    photo: {
      width: '100%',
      height: '100%',
      borderRadius: scaleWidth(46),
    },
    photoPlaceholder: {
      width: '100%',
      height: '100%',
      borderRadius: scaleWidth(46),
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border ?? theme.colors.inputBorder,
    },
    editBadge: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: scaleWidth(28),
      height: scaleWidth(28),
      borderRadius: scaleWidth(14),
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.background,
    },
    photoHint: {
      marginTop: scaleHeight(8),
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(12),
      color: theme.colors.textSecondary,
    },

    form: {
      paddingHorizontal: scaleWidth(16),
      paddingBottom: scaleHeight(16),
    },

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

    readOnlyWrap: {
      borderWidth: 1,
      borderColor: theme.colors.border ?? theme.colors.inputBorder,
    },
    readOnlyText: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
      color: theme.colors.textSecondary,
    },

    errorText: {
      marginTop: scaleHeight(4),
      color: theme.colors.error ?? '#E53935',
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(11),
      marginBottom: scaleHeight(4),
      marginLeft: scaleWidth(6),
    },

    vehicleRow: {
      flexDirection: 'row',
      gap: scaleWidth(10) as unknown as number,
    },
    vehiclePill: {
      height: scaleHeight(46),
      borderRadius: 14,
      paddingHorizontal: scaleWidth(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    vehiclePillText: {
      fontFamily: Fonts.GilroySemibold,
      fontSize: normalizeFont(13),
    },

    rowButton: {
      marginTop: scaleHeight(10),
      height: scaleHeight(54),
      borderRadius: 14,
      backgroundColor: theme.colors.card,
      paddingHorizontal: scaleWidth(16),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: scaleWidth(10) as any,
    },
    rowText: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
      color: theme.colors.textPrimary,
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

    // ✅ Custom Picker Modal (Camera + Gallery near, Cancel separate)
    sheetBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      paddingHorizontal: scaleWidth(18),
    },
    sheetCard: {
      borderRadius: 16,
      paddingVertical: scaleHeight(18),
      paddingHorizontal: scaleWidth(18),
    },
    sheetTitle: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(20),
      marginBottom: scaleHeight(6),
    },
    sheetSub: {
      fontFamily: Fonts.GilroyRegular,
      fontSize: normalizeFont(14),
      marginBottom: scaleHeight(18),
    },
    sheetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: scaleWidth(14) as any,
    },
    sheetBtn: {
      flex: 1,
      height: scaleHeight(48),
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.03)',
    },
    sheetBtnText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(14),
      letterSpacing: 0.5,
    },
    sheetCancelBtn: {
      marginTop: scaleHeight(14),
      height: scaleHeight(48),
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    sheetCancelText: {
      fontFamily: Fonts.GilroyBold,
      fontSize: normalizeFont(14),
    },
  });
}
