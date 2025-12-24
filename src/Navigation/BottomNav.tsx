import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStyles from './bottomNavStyles';

export type ScreenKey = 'Home' | 'Orders' | 'Notifications';

interface BottomNavProps {
  currentScreen: ScreenKey;
  onNavigate: (screen: ScreenKey) => void;
  unreadCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, unreadCount }) => {
  const { styles, colors } = useStyles();
  const insets = useSafeAreaInsets(); 

  const navItems: { id: ScreenKey; iconName: string; label: string; badge?: number }[] = [
    { id: 'Home', iconName: 'home', label: 'Home' },
    { id: 'Orders', iconName: 'package', label: 'Orders' },
    { id: 'Notifications', iconName: 'bell', label: 'Notifications', badge: unreadCount },
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.row}>
        {navItems.map(item => {
          const isActive = currentScreen === item.id;
          const tint = isActive ? colors.active : colors.inactive;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onNavigate(item.id)}
              activeOpacity={0.75}
              style={styles.button}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.iconWrap}>
                <Icon name={item.iconName} size={22} color={tint} />
                {!!item.badge && item.badge > 0 && (
                  <View style={[styles.badge, item.badge > 9 ? styles.badgeLarge : null]}>
                    <Text style={styles.badgeText}>{item.badge > 9 ? '9+' : String(item.badge)}</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNav;
