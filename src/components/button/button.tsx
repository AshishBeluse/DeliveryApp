import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Fonts from '../../utils/fonts';
import { normalizeFont, scaleWidth, scaleHeight } from '../../utils/responsive';

type Variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

type ButtonProps = {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
};

export default function Button({
  children,
  variant = 'default',
  size = 'default',
  onPress,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const { theme } = useTheme();

  const variantStyles = {
    default: {
      backgroundColor: theme.colors.primary,
      borderColor: 'transparent',
      textColor: theme.colors.buttonText ?? '#000',
    },
    destructive: {
      backgroundColor: theme.colors.error,
      borderColor: 'transparent',
      textColor: '#FFFFFF',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.inputBorder ?? theme.colors.border,
      textColor: theme.colors.textPrimary,
    },
    secondary: {
      backgroundColor: theme.colors.card,
      borderColor: 'transparent',
      textColor: theme.colors.textPrimary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: theme.colors.textPrimary,
    },
    link: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: theme.colors.primary,
    },
  } as const;

  const variantColor = variantStyles[variant];

  const sizeStyles = {
    default: {
      height: scaleHeight(36),
      paddingHorizontal: scaleWidth(16),
      fontSize: normalizeFont(19),
      borderRadius: 10,
      gap: scaleWidth(8),
    },
    sm: {
      height: scaleHeight(32),
      paddingHorizontal: scaleWidth(12),
      fontSize: normalizeFont(16),
      borderRadius: 8,
      gap: scaleWidth(6),
    },
    lg: {
      height: scaleHeight(40),
      paddingHorizontal: scaleWidth(20),
      fontSize: normalizeFont(20),
      borderRadius: 10,
      gap: scaleWidth(8),
    },
    icon: {
      height: scaleHeight(36),
      paddingHorizontal: scaleWidth(8),
      fontSize: 10,
      borderRadius: 10,
      gap: scaleWidth(6),
    },
  } as const;

  const s = sizeStyles[size];

  const containerStyle: ViewStyle = {
    backgroundColor: variantColor.backgroundColor,
    borderColor: variantColor.borderColor,
    borderWidth: variant === 'outline' ? 1 : 0,
    height: s.height + 16,
    // height:100,
    paddingHorizontal: s.paddingHorizontal,
    borderRadius: s.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    opacity: disabled ? 0.5 : 1,
  };

  const textStylesCombined: TextStyle = {
    fontFamily: Fonts.GilroyBold,
    fontSize: s.fontSize,
    // fontSize: s.fontSize + 10,
    color: variantColor.textColor,
    includeFontPadding: false,
    textAlign: 'center',
    // Set lineHeight to the button height to vertically center single-line text reliably
    lineHeight: s.fontSize,
    // Android vertical alignment
    textAlignVertical: Platform.OS === 'android' ? 'center' : undefined,
  };

  // render wrapper properly: TouchableOpacity when pressable, otherwise View
  const isPressable = !!onPress && !disabled;

  if (isPressable) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={[containerStyle, style]}
      >
        {renderChildren(children, textStylesCombined, textStyle, s)}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[containerStyle, style]}
    >
      {renderChildren(children, textStylesCombined, textStyle, s)}
    </View>
  );
}

/** Helper to render children consistently */
function renderChildren(
  children: React.ReactNode,
  textStylesCombined: TextStyle,
  textStyle?: StyleProp<TextStyle>,
  s?: { gap: number },
) {
  // If children is a plain string or number, render single Text
  if (typeof children === 'string' || typeof children === 'number') {
    return (
      <Text
        numberOfLines={1}
        allowFontScaling={false}
        style={[textStylesCombined, textStyle]}
      >
        {String(children)}
      </Text>
    );
  }

  // If there's only one child and it's a Text element, return it with styles applied
  const count = React.Children.count(children);
  if (count === 1) {
    const only = React.Children.only(children as any);
    if (typeof only === 'string' || typeof only === 'number') {
      return (
        <Text
          numberOfLines={1}
          allowFontScaling={false}
          style={[textStylesCombined, textStyle]}
        >
          {String(only)}
        </Text>
      );
    }
    // if it's an element (icon or text), render it as-is but apply margin if needed
    return only;
  }

  // multiple children (icon + text): map and add spacing gap
  return React.Children.map(children, (child, idx) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return (
        <Text
          key={idx}
          numberOfLines={1}
          allowFontScaling={false}
          style={[
            textStylesCombined,
            textStyle,
            { marginLeft: idx === 0 ? 0 : s?.gap ?? 8 },
          ]}
        >
          {String(child)}
        </Text>
      );
    }
    // element (icon or custom) — add margin when not first
    return (
      <View key={idx} style={{ marginLeft: idx === 0 ? 0 : s?.gap ?? 8 }}>
        {child}
      </View>
    );
  });
}

export const buttonVariants = (opts?: { variant?: Variant; size?: Size }) => {
  return {
    variant: opts?.variant ?? 'default',
    size: opts?.size ?? 'default',
  };
};

const localStyles = StyleSheet.create({});
