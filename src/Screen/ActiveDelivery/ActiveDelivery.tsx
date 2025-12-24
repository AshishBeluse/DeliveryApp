import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
// import  from './ActiveDeliveryStyles';
import { useTheme } from '../../utils/theme/ThemeProvider';
// import  from '../../components/ui/Button'; // adjust path if needed
import useStyles from './ActiveDeliveryStyles';
import Button from '../../components/button/button';

import { getItemLabel } from '../../utils/orderItem';

// Order type (match your ../App Order type)
type Order = {
  id: string;
  status: 'accepted' | 'picked_up' | 'on_the_way' | 'delivered' | string;
  restaurantName: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  items?: any[];
};

type Props = {
  order: Order;
  onUpdateStatus: (status: Order['status']) => void;
};
const ActiveDelivery: React.FC<Props> = ({ order, onUpdateStatus }) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  console.log('console___data__activwe__Delivery', order);
  useEffect(() => {
    // clear any timers on unmount (safety)
    return () => {};
  }, []);

  const restaurantName = order.restaurantName ?? 'Restaurant';

  const total = Number(order.totalAmount ?? 0);

  const deliveryAddressText =
    typeof order.deliveryAddress === 'string'
      ? order.deliveryAddress
      : JSON.stringify(order.deliveryAddress ?? '');

  const items = Array.isArray(order.items) ? order.items : [];

  const handleStatusUpdate = (status: Order['status']) => {
    if (status === 'delivered') {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onUpdateStatus(status);
      }, 1500);
    } else {
      onUpdateStatus(status);
    }
  };

  const openMaps = async (address?: string) => {
    if (!address) return Alert.alert('Address not available');
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert('Unable to open maps');
    } catch (e) {
      Alert.alert('Error', 'Could not open maps');
    }
  };

  const callPhone = async (phone: string) => {
    const url = `tel:${phone}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert('Unable to place call');
    } catch (e) {
      Alert.alert('Error', 'Could not place call');
    }
  };

  const getStatusButton = () => {
    switch (order.status) {
      case 'accepted':
        return (
          <Button
            onPress={() => handleStatusUpdate('picked_up')}
            style={[
              styles.actionBtn,
              { backgroundColor: theme.colors.primary },
            ]}
            textStyle={styles.actionBtnText}
            disabled={false}
          >
            <Icon
              name="box"
              size={18}
              color={theme.colors.buttonText ?? '#000'}
              style={styles.iconLeft}
            />
            Mark as Picked Up
          </Button>
        );
      case 'picked_up':
        return (
          <Button
            onPress={() => handleStatusUpdate('on_the_way')}
            style={[
              styles.actionBtn,
              { backgroundColor: theme.colors.primary },
            ]}
            textStyle={styles.actionBtnText}
            disabled={false}
          >
            <Icon
              name="navigation"
              size={18}
              color={theme.colors.buttonText ?? '#000'}
              style={styles.iconLeft}
            />
            Start Delivery
          </Button>
        );
      case 'on_the_way':
        return (
          <Button
            onPress={() => handleStatusUpdate('delivered')}
            style={[
              styles.actionBtn,
              { backgroundColor: theme.colors.primary },
            ]}
            textStyle={styles.actionBtnText}
            disabled={false}
          >
            <Icon
              name="check-circle"
              size={18}
              color={theme.colors.buttonText ?? '#000'}
              style={styles.iconLeft}
            />
            Complete Delivery
          </Button>
        );
      default:
        return null;
    }
  };
  const status_data = order?.status || 'accepted';
  const getStatusText = () => {
    switch (status_data) {
      case 'accepted':
        return 'Head to Restaurant';
      // case 'picked_up':
      case 'delivery':
        return 'Ready to Deliver';
      case 'on_the_way':
        return 'Delivering Now';
      case 'delivered':
        return 'Delivered Successfully';
      default:
        return 'accepted';
    }
  };

  if (showSuccess) {
    return (
      <View
        style={[styles.successCard, { backgroundColor: theme.colors.primary }]}
      >
        <Icon
          name="check-circle"
          size={56}
          color={theme.colors.buttonText ?? '#000'}
        />
        <Text
          style={[
            styles.successTitle,
            { color: theme.colors.buttonText ?? '#000' },
          ]}
        >
          Delivery Complete!
        </Text>
        <Text
          style={[
            styles.successSub,
            { color: theme.colors.buttonText ?? '#000' },
          ]}
        >
          +${total.toFixed(2)}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderColor: theme.colors.primary }]}>
      {/* Status Header */}
      <View style={styles.statusRow}>
        <Text style={[styles.statusTitle, { color: theme.colors.primary }]}>
          Active Delivery
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              { color: theme.colors.buttonText ?? '#000' },
            ]}
          >
            {getStatusText()}
          </Text>
        </View>
      </View>

      {/* Restaurant & Customer Info */}
      <View
        style={[
          styles.infoCard,
          { borderColor: theme.colors.border ?? theme.colors.inputBorder },
        ]}
      >
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.smallMuted}>From</Text>
            <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
              {restaurantName}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.smallMuted}>Amount</Text>
            <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
              ${order.totalAmount}
            </Text>
            {/* <Text style={[styles.infoValue, { color: theme.colors.primary }]}>${order.totalAmount.toFixed(2)}</Text> */}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.smallMuted}>Customer</Text>
        <Text style={styles.infoValue}>{order.customerName}</Text>

        <View style={styles.row}>
          <Icon name="phone" size={16} color={theme.colors.primary} />
          <TouchableOpacity onPress={() => callPhone(order.customerPhone)}>
            <Text
              style={[
                styles.linkText,
                { color: theme.colors.primary, marginLeft: 8 },
              ]}
            >
              {order.customerPhone}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pickup Address (if accepted) */}
      {order.status === 'accepted' && (
        <View
          style={[
            styles.infoCard,
            { borderColor: theme.colors.border ?? theme.colors.inputBorder },
          ]}
        >
          <View style={styles.rowStart}>
            <Icon
              name="box"
              size={18}
              color={theme.colors.primary}
              style={{ marginTop: 2 }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.smallMuted}>Pickup Location</Text>
              <Text style={styles.infoValue}>{order.pickupAddress}</Text>

              <View style={styles.mt8}>
                <Button
                  onPress={() => openMaps(order.pickupAddress)}
                  style={[
                    styles.outlineBtn,
                    { borderColor: theme.colors.primary },
                  ]}
                  textStyle={[
                    styles.outlineBtnText,
                    { color: theme.colors.primary },
                  ]}
                >
                  <Icon
                    name="navigation"
                    size={16}
                    color={theme.colors.primary}
                    style={styles.iconLeft}
                  />
                  Navigate to Restaurant
                </Button>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Delivery Address (if picked_up or on_the_way) */}
      {(order.status === 'picked_up' || order.status === 'on_the_way') && (
        <View
          style={[
            styles.infoCard,
            { borderColor: theme.colors.border ?? theme.colors.inputBorder },
          ]}
        >
          <View style={styles.rowStart}>
            <Icon
              name="map-pin"
              size={18}
              color={theme.colors.primary}
              style={{ marginTop: 2 }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.smallMuted}>Delivery Address</Text>
              {/* <Text style={styles.infoValue}>fffff/</Text> */}
              <Text style={styles.infoValue}>{deliveryAddressText}</Text>

              <View style={styles.row}>
                <Button
                  onPress={() => openMaps(order.deliveryAddress)}
                  style={[
                    styles.outlineBtn,
                    { flex: 1, borderColor: theme.colors.primary },
                  ]}
                  textStyle={[
                    styles.outlineBtnText,
                    { color: theme.colors.primary },
                  ]}
                >
                  <Icon
                    name="navigation"
                    size={16}
                    color={theme.colors.primary}
                    style={styles.iconLeft}
                  />
                  Navigate
                </Button>

                <View style={{ width: 10 }} />

                <Button
                  onPress={() => callPhone(order.customerPhone)}
                  style={[
                    styles.outlineBtn,
                    { borderColor: theme.colors.primary },
                  ]}
                  textStyle={[
                    styles.outlineBtnText,
                    { color: theme.colors.primary },
                  ]}
                >
                  <Icon
                    name="phone"
                    size={16}
                    color={theme.colors.primary}
                    style={styles.iconLeft}
                  />
                </Button>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Order Items */}
      <View
        style={[
          styles.infoCard,
          { borderColor: theme.colors.border ?? theme.colors.inputBorder },
        ]}
      >
        <Text style={styles.smallMuted}>Order Items:</Text>
        <View style={styles.itemsList}>
          {items.map((it: any, idx: number) => (
            <Text key={`${order.id}_${idx}`}>• {getItemLabel(it)}</Text>
          ))}
        </View>
      </View>

      {/* Action Button */}
      <View style={{ marginTop: 6 }}>{getStatusButton()}</View>
    </View>
  );
};

export default ActiveDelivery;
