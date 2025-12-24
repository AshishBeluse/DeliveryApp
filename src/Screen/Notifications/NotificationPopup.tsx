import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import useStyles from './NotificationPopupStyles';
import { useTheme } from '../../utils/theme/ThemeProvider';

type Notification = {
  id?: string;
  type?: 'order' | 'earning' | 'other' | string;
  title: string;
  message: string;
};

type Props = {
  notification: Notification;
  onClose: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};

const AUTO_CLOSE_MS = 5000;
const EXIT_ANIM_MS = 300;

const addHexAlpha = (hex: string, alphaHex = 'CC') => {
  if (typeof hex === 'string' && /^#([A-Fa-f0-9]{6})$/.test(hex)) {
    return hex + alphaHex;
  }
  return hex;
};

const NotificationPopup: React.FC<Props> = ({
  notification,
  onClose,
  containerStyle,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);

  // Animated values
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current; // 1 -> full, scales to 0

  // timer ref
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // exit animation -> run then call onClose()
  const runExitAndClose = useCallback(() => {
    // stop any running progress animation first (safe)
    try {
      progress.stopAnimation();
    } catch {}

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -40,
        duration: EXIT_ANIM_MS,
        easing: Easing.in(Easing.poly(3)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: EXIT_ANIM_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // hide and notify parent after animation completes
      setVisible(false);
      onClose();
    });
  }, [onClose, opacity, progress, translateY]);

  useEffect(() => {
    // Reset visible and animated values when a new notification arrives
    setVisible(true);
    translateY.setValue(-40);
    opacity.setValue(0);
    progress.setValue(1);

    // enter animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();

    // progress animation -> scaleX from 1 -> 0 (useNativeDriver true)
    Animated.timing(progress, {
      toValue: 0,
      duration: AUTO_CLOSE_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // auto-close timer as a backup (ensures removal even if animation hiccups)
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => {
      runExitAndClose();
    }, AUTO_CLOSE_MS);

    return () => {
      // cleanup
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      try {
        progress.stopAnimation();
        opacity.stopAnimation();
        translateY.stopAnimation();
      } catch {}
    };
    // run when notification.id changes (new notification)
  }, [notification.id, progress, translateY, opacity, runExitAndClose]);

  const handleManualClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    runExitAndClose();
  };

  const renderIcon = () => {
    const iconColor = theme.colors.buttonText ?? '#000';
    switch (notification.type) {
      case 'order':
        return <Icon name="box" size={20} color={iconColor} />;
      case 'earning':
        return <Icon name="dollar-sign" size={20} color={iconColor} />;
      default:
        return <Icon name="bell" size={20} color={iconColor} />;
    }
  };

  if (!visible) return null;

  const buttonTextColor = theme.colors.buttonText ?? '#000';
  const messageColor = addHexAlpha(buttonTextColor, 'CC');
  const progressBarColor = addHexAlpha(buttonTextColor, '66');

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ translateY }], opacity },
        containerStyle,
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <View style={styles.contentRow}>
          <View style={styles.iconWrap}>{renderIcon()}</View>

          <View style={styles.textWrap}>
            <Text
              style={[styles.title, { color: buttonTextColor }]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            <Text
              style={[styles.message, { color: messageColor }]}
              numberOfLines={2}
            >
              {notification.message}
            </Text>
          </View>

          <TouchableOpacity onPress={handleManualClose} style={styles.closeBtn}>
            <Icon name="x" size={18} color={buttonTextColor} />
          </TouchableOpacity>
        </View>

        {/* progress bar: animate scaleX (1 -> 0) for native-driver friendly animation */}
        <View style={styles.progressWrap}>
          <Animated.View
            style={[
              styles.progress,
              {
                backgroundColor: progressBarColor,
                transform: [{ scaleX: progress }],
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default NotificationPopup;
