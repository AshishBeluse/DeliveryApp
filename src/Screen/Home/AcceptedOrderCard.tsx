import React from 'react';
import { View, Text, Linking, Platform, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Button from '../../components/button/button';
// import useStyles from '../Orders/orderCardStyles';
import useStyles from './acceptedOrderCardStyles';
import { useLocation } from '../../utils/LocationContext';

export type AcceptedUiOrder = {
  id: string;
  restaurantName: string;
  customerName: string;
  customerPhone?: string;
  totalAmount: number;
  distance: string;
  items: string[];
  deliveryAddress: string;
  estimatedTime: string;
  latitude?: number;
  longitude?: number;
  status?: string;
};

type Props = {
  order: AcceptedUiOrder;
  onUpdateStatus: (orderId: string, status: 'pickedup' | 'delivered') => void;
  loading?: boolean;
};

export default function AcceptedOrderCard({
  order,
  onUpdateStatus,
  loading = false,
}: Props) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { location, refreshLocation } = useLocation();

  const callCustomer = async () => {
    const phoneRaw = order.customerPhone;
    if (!phoneRaw) return;

    const phone = phoneRaw.replace(/[^\d+]/g, ''); // keep + and digits
    if (!phone) return;

    const url = Platform.OS === 'ios' ? `telprompt:${phone}` : `tel:${phone}`;
    const can = await Linking.canOpenURL(url);
    if (can) Linking.openURL(url);
  };

  // const currentStatus = (order.status?.toLowerCase() || '').trim();

  const openInMaps = async () => {
    // destination
    const dLat = Number(order.latitude);
    const dLng = Number(order.longitude);

    if (!Number.isFinite(dLat) || !Number.isFinite(dLng)) {
      // fallback: just search address
      const query = encodeURIComponent(
        order.deliveryAddress || 'Delivery Address',
      );
      const url =
        Platform.OS === 'ios'
          ? `http://maps.apple.com/?q=${query}`
          : `https://www.google.com/maps/search/?api=1&query=${query}`;
      await Linking.openURL(url);
      return;
    }

    // origin (driver current)
    const origin = location ?? (await refreshLocation());
    const oLat = Number(origin?.latitude);
    const oLng = Number(origin?.longitude);

    // If origin missing, let Maps use "current location"
    const hasOrigin = Number.isFinite(oLat) && Number.isFinite(oLng);

    const url =
      Platform.OS === 'ios'
        ? hasOrigin
          ? `http://maps.apple.com/?saddr=${oLat},${oLng}&daddr=${dLat},${dLng}&dirflg=d`
          : `http://maps.apple.com/?daddr=${dLat},${dLng}&dirflg=d`
        : hasOrigin
        ? `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${dLat},${dLng}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&destination=${dLat},${dLng}&travelmode=driving`;

    await Linking.openURL(url);
  };

  const normalizeStatus = (s?: any) => {
    const v = String(s ?? '')
      .toLowerCase()
      .trim();

    // normalize variants
    if (v === 'picked_up' || v === 'picked up') return 'pickedup';
    if (v === 'delivered') return 'delivered';
    if (v === 'accepted') return 'accepted';

    // fallback: treat empty/unknown as accepted so PickedUp shows
    return v || 'accepted';
  };

  const currentStatus = normalizeStatus(order.status);

  // Show "Picked Up" button if status is not "pickedup" or "delivered"
  // Show "Delivered" button if status is "pickedup" (or "picked_up")
  // Default: show "Picked Up" if status is empty, null, undefined, or not pickedup/delivered

  const showPickedUp =
    currentStatus !== 'pickedup' && currentStatus !== 'delivered';
  const showDelivered = currentStatus === 'pickedup';

  return (
    <View
      style={[
        styles.card,
        { borderColor: theme.colors.border ?? theme.colors.inputBorder },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {order.restaurantName}
          </Text>
          <Text style={styles.customerName} numberOfLines={1}>
            {order.customerName}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.amount}>₹{order.totalAmount.toFixed(2)}</Text>
          <View style={styles.distanceRow}>
            <Icon
              name="navigation"
              size={14}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.distance}>{order.distance}</Text>
          </View>
        </View>
      </View>

      {/* Items */}
      <View
        style={[
          styles.itemsBox,
          { borderColor: theme.colors.border ?? theme.colors.inputBorder },
        ]}
      >
        <Text style={styles.itemsLabel}>Order Items:</Text>

        {order.items.length ? (
          order.items.map((item, index) => (
            <Text key={`${order.id}_${index}`} style={styles.itemText}>
              • {item}
            </Text>
          ))
        ) : (
          <Text style={styles.itemText}>• Items not available</Text>
        )}
      </View>

      {/* Address + ETA */}
      <View style={styles.infoSection}>
        {/* Address */}
        {/* Address + ETA */}

        {/* Address */}
        <View style={styles.infoRow}>
          {/* Icon + link (same line) */}
          <View style={styles.infoTopLine}>
            <Icon name="map-pin" size={18} color={theme.colors.primary} />
            <Pressable onPress={openInMaps} hitSlop={8}>
              {({ pressed }) => (
                <Text
                  style={[
                    styles.mapsLinkText,
                    {
                      color: theme.colors.primary ?? '#1a73e8',
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  Open in Maps
                </Text>
              )}
            </Pressable>
          </View>

          {/* Text block — starts BELOW link, not icon */}
          <View style={styles.infoTextBlock}>
            <Text style={styles.infoLabel}>Delivery Address</Text>
            <Text style={styles.infoText}>{order.deliveryAddress}</Text>
          </View>
        </View>

        {/* ETA */}
        <View style={styles.infoRow}>
          {/* Icon + label */}
          <View style={styles.infoTopLine}>
            <Icon name="clock" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Estimated Time</Text>
          </View>

          {/* ETA value BELOW label */}
          <View style={styles.infoTextBlock}>
            <Text style={styles.infoText}>{order.estimatedTime}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      {showPickedUp && (
        <Button
          onPress={() => onUpdateStatus(order.id, 'pickedup')}
          disabled={loading}
          style={[
            styles.acceptButton,
            {
              backgroundColor: loading
                ? theme.colors.card
                : theme.colors.primary,
              borderColor: theme.colors.border ?? theme.colors.inputBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.acceptText,
              {
                color: loading
                  ? theme.colors.textSecondary
                  : theme.colors.buttonText ?? '#000',
              },
            ]}
          >
            {loading ? 'Updating...' : 'Picked Up'}
          </Text>
        </Button>
      )}

      {/* {showDelivered && (
        <Button
          onPress={() => onUpdateStatus(order.id, 'delivered')}
          disabled={loading}
          style={[
            styles.acceptButton,
            {
              backgroundColor: loading
                ? theme.colors.card
                : theme.colors.primary,
              borderColor: theme.colors.border ?? theme.colors.inputBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.acceptText,
              {
                color: loading
                  ? theme.colors.textSecondary
                  : theme.colors.buttonText ?? '#000',
              },
            ]}
          >
            {loading ? 'Updating...' : 'Delivered'}
          </Text>
        </Button>
      )} */}

      {showDelivered && (
        <View style={styles.actionRow}>
          {/* Delivered button FIRST */}
          <Button
            onPress={() => onUpdateStatus(order.id, 'delivered')}
            disabled={loading}
            style={[
              styles.acceptButton,
              styles.deliveredFlexBtn,
              {
                backgroundColor: loading
                  ? theme.colors.card
                  : theme.colors.primary,
                borderColor: theme.colors.border ?? theme.colors.inputBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.acceptText,
                {
                  color: loading
                    ? theme.colors.textSecondary
                    : theme.colors.buttonText ?? '#000',
                },
              ]}
            >
              {loading ? 'Updating...' : 'Delivered'}
            </Text>
          </Button>

          {/* Call button on RIGHT */}
          <Pressable
            onPress={callCustomer}
            disabled={!order.customerPhone || loading}
            hitSlop={10}
            style={({ pressed }) => [
              styles.callBtn,
              {
                borderColor: theme.colors.border ?? theme.colors.inputBorder,
                backgroundColor: theme.colors.card,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Icon
              name="phone-call"
              size={18}
              color={
                !order.customerPhone || loading
                  ? theme.colors.textSecondary
                  : theme.colors.primary
              }
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}
