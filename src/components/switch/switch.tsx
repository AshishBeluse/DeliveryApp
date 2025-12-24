import React from 'react';
import { View, Animated, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import { scaleWidth } from '../../utils/responsive';

type SwitchProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
  style?: any;
};

export default function Switch({
  value,
  onValueChange,
  disabled = false, 
  style,
}: SwitchProps) {
  const { theme } = useTheme();

  // Animation for thumb slide
  const anim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [value]);

  // Track colors
  const trackColor = value
    ? theme.colors.primary
    : theme.colors.tabTextInactive ?? theme.colors.tabTextInactive;

  // Thumb slide animation
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [scaleWidth(2), scaleWidth(18)], // left → right
  });

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[
        styles.switch,
        {
          backgroundColor: trackColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: theme.colors.card,
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: scaleWidth(36),
    height: scaleWidth(20),
    borderRadius: scaleWidth(20),
    justifyContent: 'center',
  },
  thumb: {
    width: scaleWidth(16),
    height: scaleWidth(16),
    borderRadius: scaleWidth(16),
    position: 'absolute',
  },
});

