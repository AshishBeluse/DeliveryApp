import React, { createContext, useContext, PropsWithChildren } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Fonts from '../../utils/fonts';
import { normalizeFont, scaleWidth, scaleHeight } from '../../utils/responsive';

type Variant = 'default' | 'destructive';

type AlertProps = PropsWithChildren<{
  variant?: Variant;
  style?: ViewStyle;
}>;

const AlertTextColorContext = createContext<string | undefined>(undefined);

export function Alert({ variant = 'default', style, children }: AlertProps) {
  const { theme } = useTheme();

  const borderColor =
    variant === 'destructive'
      ? theme.colors.error ?? '#E11D48'
      : theme.colors.inputBorder ?? theme.colors.border ?? '#E5E7EB';

  const textColor =
    variant === 'destructive'
      ? theme.colors.error ?? '#E11D48'
      : theme.colors.textPrimary ?? '#111827';

  return (
    <AlertTextColorContext.Provider value={textColor}>
      <View
        style={[
          styles.alert,
          {
            backgroundColor: theme.colors.card,
            borderColor,
          },
          style,
        ]}
      >
        {children}
      </View>
    </AlertTextColorContext.Provider>
  );
}

type TextProps = PropsWithChildren<{ style?: TextStyle }>;

export function AlertTitle({ children, style }: TextProps) {
  const color = useContext(AlertTextColorContext);
  return (
    <Text style={[styles.title, { color }, style]} numberOfLines={1}>
      {children}
    </Text>
  );
}

export function AlertDescription({ children, style }: TextProps) {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        styles.description,
        { color: theme.colors.textSecondary ?? '#6B7280' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  alert: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleWidth(14),
    marginVertical: scaleHeight(6),
  },
  title: {
    fontFamily: Fonts.GilroyBold,
    fontSize: normalizeFont(15),
    marginBottom: scaleHeight(4),
  },
  description: {
    fontFamily: Fonts.GilroyRegular,
    fontSize: normalizeFont(13),
    lineHeight: normalizeFont(18),
  },
});
