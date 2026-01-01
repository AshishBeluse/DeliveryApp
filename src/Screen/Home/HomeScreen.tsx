import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../utils/theme/ThemeProvider';
import useStyles from './homeStyles';
import Button from '../../components/button/button';
import Switch from '../../components/switch/switch';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import ActiveDelivery from '../ActiveDelivery/ActiveDelivery';
import AcceptedOrderList from './AcceptedOrderList';
import { useFocusEffect } from '@react-navigation/native';
import AcceptedOrderCard from './AcceptedOrderCard';
import { formatDeliveryAddress, extractLatLng } from '../../utils/address';
import {
  updateStatusThunk,
  fetchPendingOrdersThunk,
  fetchAcceptedOrdersThunk,
} from '../../redux/ordersSlice/ordersSlice';
import {
  setOnlineThunk,
  dashboardThunk,
} from '../../redux/driverSlice/driverSlice';

import { connectSocket, disconnectSocket } from '../../services/realtime';
import { setDashboardFromSocket } from '../../redux/driverSlice/driverSlice';

const HomeScreen: React.FC = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const token = useAppSelector(s => s.auth.token);
  const isOnline = useAppSelector(s => s.driver.isOnline);
  const driverId = useAppSelector(s => s.auth.driver?.id);

  // ✅ REAL dashboard data
  const dashboard = useAppSelector(s => s.driver.dashboard);
  const dashboardLoading = useAppSelector(s => s.driver.status === 'loading');
  const dashboardError = useAppSelector(s => s.driver.error);

  // ✅ REAL active order (from orders slice)
  const activeOrder = useAppSelector(s => s.orders.activeOrder);
  const acceptedOrders = useAppSelector(s => s.orders.accepted);
  const ordersLoading = useAppSelector(s => s.orders.status === 'loading');

  const [onlineLoading, setOnlineLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // ✅ Fetch dashboard on mount (token + driver id required)

  useEffect(() => {
    if (!token || !driverId) return;

    const socket = connectSocket(token);

    socket.on('connect', () => {
      socket.emit('join_driver_room', driverId);
    });

    socket.on('dashboard_updated', data => {
      dispatch(setDashboardFromSocket(data));
    });

    return () => {
      socket.off('dashboard_updated');
      disconnectSocket();
    };
  }, [token, driverId, dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      if (!token) return;

      dispatch(dashboardThunk());
      dispatch(fetchAcceptedOrdersThunk());

      // optional: refresh pending too
      if (isOnline) {
        dispatch(fetchPendingOrdersThunk());
      }
    }, [token, isOnline, dispatch]),
  );

  const handleToggleOnline = async () => {
    if (onlineLoading) return;

    if (!token) {
      Alert.alert('Login required', 'Please login again.');
      return;
    }

    const newStatus = !isOnline;

    try {
      setOnlineLoading(true);
      await dispatch(setOnlineThunk({ isOnline: newStatus })).unwrap();

      // optional: refresh dashboard after going online/offline
      dispatch(dashboardThunk());
    } catch (e: any) {
      Alert.alert('Status', e?.message ?? 'Failed to update status');
    } finally {
      setOnlineLoading(false);
    }
  };

  // const showCTA = useMemo(() => !isOnline, [isOnline]);
  const showCTA = !isOnline;

  // ✅ safe numbers from API
  const todayEarnings = Number(dashboard?.todaysEarning ?? 0);
  const completedToday = Number(dashboard?.todaysCompleted ?? 0);

  const handleUpdateStatusFromHome = async (status: string) => {
    if (!activeOrder?.id) return;

    try {
      await dispatch(
        updateStatusThunk({ orderId: Number(activeOrder.id), status }),
      ).unwrap();

      // refresh stats + list
      dispatch(dashboardThunk());
      if (isOnline) dispatch(fetchPendingOrdersThunk());
    } catch (e: any) {
      Alert.alert('Update status', String(e));
    }
  };

  const handleUpdateAcceptedOrderStatus = async (
    orderId: string,
    status: 'pickedup' | 'delivered',
  ) => {
    setUpdatingStatus(orderId);
    try {
      await dispatch(
        updateStatusThunk({ orderId: Number(orderId), status }),
      ).unwrap();

      // refresh accepted orders and dashboard
      dispatch(fetchAcceptedOrdersThunk());
      dispatch(dashboardThunk());
    } catch (e: any) {
      Alert.alert('Update status', String(e));
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.card,
            borderBottomColor: theme.colors.border ?? theme.colors.inputBorder,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            <Icon
              name="user"
              size={20}
              color={theme.colors.buttonText ?? '#000'}
            />
          </View>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.driverId}>Driver ID: #{driverId ?? '-'}</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {/* Fixed Header Content - Only scrolls if no accepted orders */}
        {acceptedOrders.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {/* Optional error banner */}
            {!!dashboardError && (
              <Text style={{ color: theme.colors.error, marginBottom: 8 }}>
                {dashboardError}
              </Text>
            )}

            {/* Online card */}
            <View
              style={[
                styles.onlineCard,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border ?? theme.colors.inputBorder,
                },
              ]}
            >
              <View style={styles.onlineRow}>
                <View style={styles.onlineLeft}>
                  <View
                    style={[
                      styles.onlineDot,
                      {
                        backgroundColor: isOnline
                          ? theme.colors.primary
                          : theme.colors.textSecondary,
                      },
                    ]}
                  />
                  <View style={styles.onlineTexts}>
                    <Text
                      style={
                        isOnline
                          ? styles.onlineTitleActive
                          : styles.onlineTitleInactive
                      }
                    >
                      {isOnline ? 'You are Online' : 'You are Offline'}
                    </Text>
                    <Text style={styles.onlineSubtitle}>
                      {isOnline ? 'Receiving orders' : 'Not receiving orders'}
                    </Text>
                  </View>
                </View>

                <Switch
                  value={isOnline}
                  onValueChange={handleToggleOnline}
                  disabled={onlineLoading}
                />
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon
                  name="trending-up"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.sectionTitle}> Today's Performance</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Icon
                      name="dollar-sign"
                      size={16}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.statLabel}>Earnings</Text>
                  </View>

                  <Text style={styles.earningsText}>
                    {dashboardLoading ? '...' : `$${todayEarnings.toFixed(2)}`}
                  </Text>

                  <Text style={styles.smallMuted}>today</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <Icon name="box" size={16} color={theme.colors.primary} />
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>

                  <Text style={styles.bigWhite}>
                    {dashboardLoading ? '...' : completedToday}
                  </Text>

                  <Text style={styles.smallMuted}>deliveries today</Text>
                </View>
              </View>

              {/* ✅ active order from redux */}
              {/* {activeOrder ? (
              <View style={styles.activeCard}>
                <View style={styles.statHeader}>
                  <Icon
                    name="map-pin"
                    size={16}
                    color={theme.colors.buttonText || '#000'}
                  />
                  <Text style={styles.activeTitle}>
                    {' '}
                    Active Delivery in Progress
                  </Text>
                </View>

                <Text style={styles.activeText}>
                  Order #{activeOrder.id}
                </Text>

                <Text style={styles.activeSub}>
                  ₹{Number(activeOrder.totalAmount ?? 0).toFixed(2)}
                </Text>
              </View>
            ) : (
              <View style={styles.noActiveCard}>
                <View style={styles.statHeader}>
                  <Icon
                    name="clock"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.noActiveTitle}> No Active Delivery</Text>
                </View>
                <Text style={styles.noActiveText}>
                  {isOnline
                    ? 'Waiting for new orders...'
                    : 'Go online to receive orders'}
                </Text>
              </View>
            )} */}

              {showCTA && (
                <View style={styles.ctaWrap}>
                  <Button
                    onPress={handleToggleOnline}
                    style={[
                      styles.ctaBtn,
                      { backgroundColor: theme.colors.primary },
                    ]}
                    textStyle={[
                      styles.ctaText,
                      { color: theme.colors.buttonText },
                    ]}
                  >
                    Go Online to Start Earning
                  </Button>
                </View>
              )}
            </View>
          </ScrollView>
        ) : (
          <>
            {/* Fixed Header Content - Not scrollable */}
            <View style={{ flexShrink: 0 }}>
              {/* Optional error banner */}
              {!!dashboardError && (
                <Text
                  style={{
                    color: theme.colors.error,
                    marginBottom: 8,
                    paddingHorizontal: 16,
                  }}
                >
                  {dashboardError}
                </Text>
              )}

              {/* Online card */}
              <View
                style={[
                  styles.onlineCard,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor:
                      theme.colors.border ?? theme.colors.inputBorder,
                  },
                ]}
              >
                <View style={styles.onlineRow}>
                  <View style={styles.onlineLeft}>
                    <View
                      style={[
                        styles.onlineDot,
                        {
                          backgroundColor: isOnline
                            ? theme.colors.primary
                            : theme.colors.textSecondary,
                        },
                      ]}
                    />
                    <View style={styles.onlineTexts}>
                      <Text
                        style={
                          isOnline
                            ? styles.onlineTitleActive
                            : styles.onlineTitleInactive
                        }
                      >
                        {isOnline ? 'You are Online' : 'You are Offline'}
                      </Text>
                      <Text style={styles.onlineSubtitle}>
                        {isOnline ? 'Receiving orders' : 'Not receiving orders'}
                      </Text>
                    </View>
                  </View>

                  <Switch
                    value={isOnline}
                    onValueChange={handleToggleOnline}
                    disabled={onlineLoading}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon
                    name="trending-up"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.sectionTitle}> Today's Performance</Text>
                </View>

                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <Icon
                        name="dollar-sign"
                        size={16}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.statLabel}>Earnings</Text>
                    </View>

                    <Text style={styles.earningsText}>
                      {dashboardLoading
                        ? '...'
                        : `$${todayEarnings.toFixed(2)}`}
                    </Text>

                    <Text style={styles.smallMuted}>today</Text>
                  </View>

                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <Icon name="box" size={16} color={theme.colors.primary} />
                      <Text style={styles.statLabel}>Completed</Text>
                    </View>

                    <Text style={styles.bigWhite}>
                      {dashboardLoading ? '...' : completedToday}
                    </Text>

                    <Text style={styles.smallMuted}>deliveries today</Text>
                  </View>
                </View>

                {/* ✅ active order from redux */}
                {/* {activeOrder ? (
                  <View style={styles.activeCard}>
                    <View style={styles.statHeader}>
                      <Icon
                        name="map-pin"
                        size={16}
                        color={theme.colors.buttonText || '#000'}
                      />
                      <Text style={styles.activeTitle}>
                        {' '}
                        Active Delivery in Progress
                      </Text>
                    </View>

                    <Text style={styles.activeText}>
                      Order #{activeOrder.id}
                    </Text>

                    <Text style={styles.activeSub}>
                      ₹{Number(activeOrder.totalAmount ?? 0).toFixed(2)}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.noActiveCard}>
                    <View style={styles.statHeader}>
                      <Icon
                        name="clock"
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.noActiveTitle}> No Active Delivery</Text>
                    </View>
                    <Text style={styles.noActiveText}>
                      {isOnline
                        ? 'Waiting for new orders...'
                        : 'Go online to receive orders'}
                    </Text>
                  </View>
                )} */}

                {showCTA && (
                  <View style={styles.ctaWrap}>
                    <Button
                      onPress={handleToggleOnline}
                      style={[
                        styles.ctaBtn,
                        { backgroundColor: theme.colors.primary },
                      ]}
                      textStyle={[
                        styles.ctaText,
                        { color: theme.colors.buttonText },
                      ]}
                    >
                      Go Online to Start Earning
                    </Button>
                  </View>
                )}
              </View>

              {/* Accepted Orders Section Title - Fixed */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="package" size={16} color={theme.colors.primary} />
                  <Text style={styles.sectionTitle}>Accepted Orders</Text>
                </View>
              </View>
            </View>

            {/* Accepted Orders FlatList - scrolls only this section */}
            {/* <FlatList
              data={acceptedOrders}
              keyExtractor={item => String(item?.id ?? '')}
              ListHeaderComponent={null}
              nestedScrollEnabled={true}
              style={{ flex: 1 }}
              renderItem={({ item }) => {
                const rawAddress =
                  item?.deliveryAddress ??
                  item?.address?.full ??
                  item?.delivery?.address ??
                  item?.customer?.address ??
                  null;
                const { latitude, longitude } = extractLatLng(rawAddress);
                const deliveryAddress = formatDeliveryAddress(rawAddress);

                // Parse items
                let items: string[] = [];
                if (item?.items) {
                  if (Array.isArray(item.items)) {
                    items = item.items.map((i: any) => {
                      if (typeof i === 'object' && i !== null) {
                        return i?.name ?? String(i);
                      }
                      return String(i);
                    });
                  } else if (typeof item.items === 'string') {
                    try {
                      let parsed = JSON.parse(item.items);
                      if (typeof parsed === 'string') {
                        parsed = JSON.parse(parsed);
                      }
                      if (Array.isArray(parsed)) {
                        items = parsed.map(
                          (item: any) => item?.name ?? String(item),
                        );
                      } else if (parsed && typeof parsed === 'object') {
                        items = [parsed?.name ?? String(parsed)];
                      }
                    } catch {
                      items = [item.items];
                    }
                  }
                }

                const customerName = item?.appCustomer?.name
                  ? item.appCustomer.name
                  : item?.customerId
                  ? `Customer #${item.customerId}`
                  : 'Customer';

                return (
                  <View style={{ paddingHorizontal: 16 }}>
                    <AcceptedOrderCard
                      order={{
                        id: String(item?.id ?? ''),
                        restaurantName:
                          item?.restaurant?.name ?? 'Unknown Restaurant',
                        customerName,
                        totalAmount: Number(
                          item?.totalAmount ??
                            item?.totalCost ??
                            item?.subtotal ??
                            0,
                        ),
                        distance: '2.5 km',
                        items,
                        deliveryAddress,
                        estimatedTime: String(
                          item?.estimatedDeliveryTime ?? '30 mins',
                        ),
                        latitude,
                        longitude,
                        status: item?.status,
                      }}
                      onUpdateStatus={handleUpdateAcceptedOrderStatus}
                      loading={
                        ordersLoading || updatingStatus === String(item?.id)
                      }
                    />
                  </View>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
              contentContainerStyle={{
                paddingBottom: 16,
                paddingHorizontal: 0,
              }}
              showsVerticalScrollIndicator={false}
            /> */}
            <AcceptedOrderList
              orders={acceptedOrders}
              onUpdateStatus={handleUpdateAcceptedOrderStatus}
              loadingOrderId={updatingStatus}
              key={acceptedOrders.length}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
