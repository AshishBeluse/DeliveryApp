import React, { useEffect, useMemo } from 'react';
import { View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiErrorMessage } from '../../services/http';
import { useTheme } from '../../utils/theme/ThemeProvider';
import useStyles from './ordersScreenStyles';

import DriverStats from '../DriverStats/DriverStats';
import OrderList from './OrderList';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchPendingOrdersThunk,
  acceptOrderThunk,
} from '../../redux/ordersSlice/ordersSlice';
import { dashboardThunk } from '../../redux/driverSlice/driverSlice';

const OrdersScreen: React.FC = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const token = useAppSelector(s => s.auth.token);
  const isOnline = useAppSelector(s => s.driver.isOnline);

  // dashboard slice
  const dashboard = useAppSelector(s => s.driver.dashboard);
  const driverStatus = useAppSelector(s => s.driver.status);
  const dashboardLoading = driverStatus === 'loading';

  // orders slice
  const pendingOrders = useAppSelector(s => s.orders.pending);
  const activeOrder = useAppSelector(s => s.orders.activeOrder);
  const ordersLoading = useAppSelector(s => s.orders.status === 'loading');

  const activeOrders = useMemo(
    () => (activeOrder ? [activeOrder] : []),
    [activeOrder],
  );

  // fetch dashboard
  useEffect(() => {
    if (!token) return;
    dispatch(dashboardThunk());
  }, [token, dispatch]);

  // fetch pending orders when online
  useEffect(() => {
    if (!isOnline) return;
    if (!token) return;
    dispatch(fetchPendingOrdersThunk());
  }, [isOnline, token, dispatch]);

  const handleAcceptOrder = async (orderId: string) => {
    if (!token) return Alert.alert('Login required', 'Please login again.');

    if (activeOrders.length >= 2) {
      return Alert.alert(
        'Limit reached',
        'You can only accept 2 orders at a time',
      );
    }

    try {
      await dispatch(acceptOrderThunk({ orderId: Number(orderId) })).unwrap();

      await dispatch(fetchPendingOrdersThunk()).unwrap();
      await dispatch(dashboardThunk()).unwrap();

      Alert.alert('Success', 'Order accepted. Go to Home to start delivery.');
    } catch (err: any) {
      Alert.alert(
        'Accept Order',
        getApiErrorMessage(err, 'Failed to accept order'),
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header (fixed) */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.card,
            borderBottomColor: theme.colors.border ?? theme.colors.inputBorder,
          },
        ]}
      >
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerSubtitle}>
          {isOnline ? 'Ready to deliver' : 'You are offline'}
        </Text>
      </View>

      {/* Stats (fixed) */}
      <View style={styles.container}>
        <DriverStats
          todayEarnings={Number(dashboard?.todaysEarning ?? 0)}
          completedToday={Number(dashboard?.todaysCompleted ?? 0)}
          activeOrders={activeOrders.length}
          loading={dashboardLoading}
        />
      </View>

      {/* Available Orders / Offline (list area must be flex: 1) */}
      <View style={[styles.section, { flex: 1 }]}>
        {!isOnline ? (
          <View style={styles.offlineWrap}>
            <Icon
              name="minus-circle"
              size={64}
              color={theme.colors.mortar ?? theme.colors.textSecondary}
            />
            <Text style={styles.offlineTitle}>You are Offline</Text>
            <Text style={styles.offlineSubtitle}>
              Go to Home screen and toggle online to receive orders
            </Text>
          </View>
        ) : (
          <>
            {/* Available header (fixed) */}
            <View style={styles.availableHeader}>
              <Icon name="box" size={18} color={theme.colors.primary} />
              <Text style={styles.availableTitle}> Available Orders</Text>

              <View
                style={[
                  styles.countBadge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    { color: theme.colors.buttonText ?? '#000' },
                  ]}
                >
                  {pendingOrders.length}
                </Text>
              </View>
            </View>

            {/* Empty state OR list (ONLY list scrolls) */}
            {pendingOrders.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Icon
                  name="box"
                  size={64}
                  color={theme.colors.textSecondary}
                  style={{ opacity: 0.5 }}
                />
                <Text style={styles.emptyText}>
                  {ordersLoading ? 'Loading orders...' : 'No orders available'}
                </Text>
                <Text style={styles.emptySub}>
                  {ordersLoading
                    ? 'Please wait'
                    : 'New orders will appear here'}
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <OrderList
                  orders={pendingOrders}
                  onAcceptOrder={handleAcceptOrder}
                  hasActiveOrder={activeOrders.length >= 2}
                />
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;
