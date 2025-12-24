import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback, 
  Platform,
} from 'react-native';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Fonts from '../../utils/fonts';
import { normalizeFont, scaleWidth, scaleHeight } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';

type NavCtx = {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
};

const NavigationMenuContext = createContext<NavCtx | null>(null);

/* ---------- Root ---------- */
export function NavigationMenu({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: any;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = useCallback((id: string) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);
  return (
    <NavigationMenuContext.Provider value={{ openId, open, close }}>
      <View style={[styles.root, style]}>{children}</View>
    </NavigationMenuContext.Provider>
  );
}

/* ---------- List ---------- */
export function NavigationMenuList({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: any;
}) {
  return <View style={[styles.list, style]}>{children}</View>;
}

/* ---------- Item ---------- */
export function NavigationMenuItem({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: any;
}) {
  return <View style={[styles.item, style]}>{children}</View>;
}

/* ---------- Trigger (button with id) ---------- */
export function NavigationMenuTrigger({
  id,
  children,
  style,
  compact,
}: {
  id: string;
  children?: React.ReactNode;
  style?: any;
  compact?: boolean;
}) {
  const ctx = useContext(NavigationMenuContext);
  const theme = useTheme().theme;
  const isOpen = ctx?.openId === id;
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => (isOpen ? ctx?.close() : ctx?.open(id))}
      style={[
        styles.trigger,
        { backgroundColor: theme.colors.background },
        isOpen && { backgroundColor: theme.colors.card },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {typeof children === 'string' ? (
          <Text
            style={[styles.triggerText, { color: theme.colors.textPrimary }]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
        <Icon
          name="chevron-down"
          size={14}
          color={theme.colors.textSecondary}
          style={{
            marginLeft: 6,
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
          }}
        />
      </View>
      {/* content slot is a separate component NavigationMenuContent */}
    </TouchableOpacity>
  );
}

/* ---------- Content (renders Modal dropdown when its id is open) ---------- */
export function NavigationMenuContent({
  id,
  children,
  width = '90%',
  style,
  align = 'center',
}: {
  id: string;
  children?: React.ReactNode;
  width?: string | number;
  style?: any;
  align?: 'start' | 'center' | 'end';
}) {
  const ctx = useContext(NavigationMenuContext);
  const theme = useTheme().theme;
  const visible = ctx?.openId === id;

  if (!ctx) {
    console.warn('NavigationMenuContent used outside NavigationMenu root');
    return null;
  }

  return (
    <Modal
      visible={!!visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={ctx.close}
    >
      <TouchableWithoutFeedback onPress={ctx.close}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer} pointerEvents="box-none">
        <View
          style={[
            styles.popover,
            {
              width: width,
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border ?? theme.colors.inputBorder,
            },
            align === 'start'
              ? { alignSelf: 'flex-start' }
              : align === 'end'
              ? { alignSelf: 'flex-end' }
              : { alignSelf: 'center' },
            style,
          ]}
        >
          <ScrollView
            contentContainerStyle={{ paddingVertical: scaleHeight(8) }}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- Link / Item inside content ---------- */
export function NavigationMenuLink({
  title,
  subtitle,
  onPress,
  disabled,
  style,
  right,
}: {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
  right?: React.ReactNode;
}) {
  const theme = useTheme().theme;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.contentItem, style]}
    >
      <View style={{ flex: 1 }}>
        {title ? (
          <Text style={[styles.itemTitle, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text
            style={[styles.itemSubtitle, { color: theme.colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={{ marginLeft: 8 }}>{right}</View> : null}
    </TouchableOpacity>
  );
}

/* ---------- Indicator (small triangle) ---------- */
export function NavigationMenuIndicator({ style }: { style?: any }) {
  const theme = useTheme().theme;
  return (
    <View
      style={[
        styles.indicator,
        { borderBottomColor: theme.colors.border ?? theme.colors.inputBorder },
        style,
      ]}
    />
  );
}

/* ---------- Viewport (simple wrapper) ---------- */
export function NavigationMenuViewport({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: any;
}) {
  return <View style={[styles.viewport, style]}>{children}</View>;
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(8) as unknown as number,
  },
  item: {
    position: 'relative',
  },
  trigger: {
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(8),
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerText: {
    fontFamily: Fonts.GilroyBold,
    fontSize: normalizeFont(14),
  },

  /* Modal / Popover */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 64 : 76,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 12,
    // allow clicks to pass to popover area
    pointerEvents: 'box-none',
  },
  popover: {
    maxHeight: scaleHeight(320),
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: scaleWidth(8),
    overflow: 'hidden',
  },

  /* Content items */
  contentItem: {
    paddingVertical: scaleHeight(10),
    paddingHorizontal: scaleWidth(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontFamily: Fonts.GilroyBold,
    fontSize: normalizeFont(14),
  },
  itemSubtitle: {
    fontFamily: Fonts.GilroyRegular,
    fontSize: normalizeFont(12),
    marginTop: 4,
  },

  /* indicator triangle */
  indicator: {
    width: 12,
    height: 8,
    alignSelf: 'center',
    marginTop: -6,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    backgroundColor: 'transparent',
  },

  viewport: {
    // placeholder — not used heavily in this simple impl
  },
});

export default {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};

