import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../utils/theme/ThemeProvider';
import useStyles from './notificationsStyles';
import { initialNotifications, Notification } from '../../Data/mock';

export default function NotificationsScreen() {
  const styles = useStyles();
  const { theme } = useTheme();

  const [items, setItems] = useState<Notification[]>(initialNotifications);

  const unreadCount = useMemo(() => items.filter(n => !n.read).length, [items]);

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));

  const toggleRead = (id: string) =>
    setItems(prev => prev.map(n => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>{unreadCount} unread</Text>
        </View>

        <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn} activeOpacity={0.8}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => toggleRead(item.id)}
              activeOpacity={0.85}
              style={[styles.card, !item.read ? styles.cardUnread : null]}
            >
              <View style={styles.cardRow}>
                <View style={styles.iconWrap}>
                  <Icon
                    name={item.read ? 'check-circle' : 'bell'}
                    size={18}
                    color={item.read ? theme.colors.textSecondary : theme.colors.primary}
                  />
                </View>

                <View style={styles.textWrap}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMsg}>{item.message}</Text>
                  <Text style={styles.cardTime}>{item.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView> 
  );
}
