import React from 'react';
import { View, Text, Linking, Platform, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../utils/theme/ThemeProvider';
import Button from '../../components/button/button';
import useStyles from './orderCardStyles';
import { useLocation } from '../../utils/LocationContext';

export type UiOrder = {
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
};

type Props = {
  order: UiOrder;
  disabled?: boolean;
  onAccept: () => void;
  onPress?: () => void;
};

export default function OrderCard({
  order,
  disabled = false,
  onAccept,
  onPress,
}: Props) {
  const styles = useStyles();
  const { theme } = useTheme();
  const { location, refreshLocation } = useLocation();
  console.log(order);
  const openInMaps = async () => {
    // destination (order)
    const dLat = Number(order.latitude);
    const dLng = Number(order.longitude);

    // If no valid lat/lng, fallback to address search
    if (!Number.isFinite(dLat) || !Number.isFinite(dLng)) {
      const query = encodeURIComponent(
        order.deliveryAddress || 'Delivery Address',
      );
      const url =
        Platform.OS === 'ios'
          ? `http://maps.apple.com/?q=${query}`
          : `https://www.google.com/maps/search/?api=1&query=${query}`;

      return Linking.openURL(url);
    }

    // origin (driver current)
    const origin = location ?? (await refreshLocation());
    const oLat = Number(origin?.latitude);
    const oLng = Number(origin?.longitude);
    const hasOrigin = Number.isFinite(oLat) && Number.isFinite(oLng);

    const url =
      Platform.OS === 'ios'
        ? hasOrigin
          ? `http://maps.apple.com/?saddr=${oLat},${oLng}&daddr=${dLat},${dLng}&dirflg=d`
          : `http://maps.apple.com/?daddr=${dLat},${dLng}&dirflg=d`
        : hasOrigin
        ? `https://www.google.com/maps/dir/?api=1&origin=${oLat},${oLng}&destination=${dLat},${dLng}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&destination=${dLat},${dLng}&travelmode=driving`;

    return Linking.openURL(url);
  };

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
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
            {/* ✅ Top line: icon + link always aligned */}
            <View style={styles.topLine}>
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

            {/* Below content */}
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoLabel}>Delivery Address</Text>
              <Text style={styles.infoText}>{order.deliveryAddress}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.topLine}>
              <Icon name="clock" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.infoLabel}>Estimated Time</Text>
            </View>
            <View style={styles.infoTextBlock}>
              <Text style={styles.infoText}>{order.estimatedTime}</Text>
            </View>
          </View>
        </View>

        {/* Accept Button */}
        <Button
          onPress={onAccept}
          disabled={disabled}
          style={[
            styles.acceptButton,
            {
              backgroundColor: disabled
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
                color: disabled
                  ? theme.colors.textSecondary
                  : theme.colors.buttonText ?? '#000',
              },
            ]}
          >
            {disabled ? 'Complete Current Delivery First' : 'Accept Order'}
          </Text>
        </Button>
      </View>
    </Pressable>
  );
}
