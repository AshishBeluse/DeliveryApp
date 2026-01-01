import React from 'react';
import { View, Text, Linking, Platform, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Button from '../../components/button/button';
import useStyles from '../Orders/orderCardStyles';

export type AcceptedUiOrder = {
  id: string;
  restaurantName: string;
  customerName: string;
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

  const openInMaps = async () => {
    const lat = order.latitude;
    const lng = order.longitude;

    // ✅ pin-point (best)
    if (typeof lat === 'number' && typeof lng === 'number') {
      const url =
        Platform.OS === 'ios'
          ? `http://maps.apple.com/?daddr=${lat},${lng}`
          : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

      const can = await Linking.canOpenURL(url);
      if (can) return Linking.openURL(url);
    }

    // ✅ fallback: search by address
    const query = encodeURIComponent(
      order.deliveryAddress || 'Delivery Address',
    );
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?q=${query}`
        : `https://www.google.com/maps/search/?api=1&query=${query}`;

    const can = await Linking.canOpenURL(url);
    if (can) Linking.openURL(url);
  };

  // const currentStatus = (order.status?.toLowerCase() || '').trim();

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
        <View style={styles.infoRow}>
          <Icon
            name="map-pin"
            size={18}
            color={theme.colors.primary}
            style={{ marginTop: 2, marginRight: 4 }}
          />
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={openInMaps}
              hitSlop={8}
              style={{ alignSelf: 'flex-start', marginBottom: 8 }}
            >
              {({ pressed }) => (
                <Text
                  style={{
                    color: theme.colors.primary ?? '#1a73e8',
                    textDecorationLine: 'underline',
                    opacity: pressed ? 0.7 : 1,
                    fontSize: 14,
                  }}
                >
                  Open in Maps
                </Text>
              )}
            </Pressable>

            <Text style={styles.infoLabel}>Delivery Address</Text>
            <Text style={styles.infoText}>{order.deliveryAddress}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon
            name="clock"
            size={18}
            color={theme.colors.textSecondary}
            style={{ marginTop: 2, marginRight: 4 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>Estimated Time</Text>
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

      {showDelivered && (
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
      )}
    </View>
  );
}
