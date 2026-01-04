import React, { useMemo } from 'react';
import { View, FlatList } from 'react-native';
import useStyles from './acceptedOrderListStyles';
import AcceptedOrderCard, { AcceptedUiOrder } from './AcceptedOrderCard';
import { formatDeliveryAddress, extractLatLng } from '../../utils/address';

type Props = {
  orders: any[];
  onUpdateStatus: (orderId: string, status: 'pickedup' | 'delivered') => void;
  loadingOrderId?: string | null;
};

function safeText(v: unknown, fallback = 'No Address') {
  if (v === null || v === undefined) return fallback;

  if (typeof v === 'string') return v;

  // sometimes backend sends object/array
  try {
    const s = JSON.stringify(v);
    return s && s !== '{}' ? s : fallback;
  } catch {
    return String(v) || fallback;
  }
}

const toAcceptedUiOrder = (o: any): AcceptedUiOrder => {
  const rawAddress =
    o?.deliveryAddress ??
    o?.address?.full ??
    o?.delivery?.address ??
    o?.customer?.address ??
    null;

  const { latitude, longitude } = extractLatLng(rawAddress);
  const deliveryAddress = formatDeliveryAddress(rawAddress);

  // Parse items from string if needed (API returns double-encoded JSON string)
  let items: string[] = [];
  if (o?.items) {
    if (Array.isArray(o.items)) {
      // If it's already an array, map directly
      items = o.items.map((i: any) => {
        if (typeof i === 'object' && i !== null) {
          return i?.name ?? String(i);
        }
        return String(i);
      });
    } else if (typeof o.items === 'string') {
      try {
        // First parse to handle escaped JSON string
        let parsed = JSON.parse(o.items);
        // If the result is still a string, parse again (double-encoded)
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        // Now we should have an array or object
        if (Array.isArray(parsed)) {
          items = parsed.map((item: any) => item?.name ?? String(item));
        } else if (parsed && typeof parsed === 'object') {
          items = [parsed?.name ?? String(parsed)];
        } else {
          items = [String(parsed)];
        }
      } catch {
        // If parsing fails, try to use as-is
        items = [o.items];
      }
    }
  }

  // Get customer name
  let customerName = 'Customer';
  if (o?.appCustomer?.name) {
    customerName = o.appCustomer.name;
  } else if (o?.customerId) {
    customerName = `Customer #${o.customerId}`;
  }

  return {
    id: String(o?.id ?? ''),
    restaurantName: o?.restaurant?.name ?? 'Unknown Restaurant',
    customerName,
    customerPhone: o?.appCustomer?.phone
      ? String(o.appCustomer.phone)
      : undefined,
    totalAmount: Number(o?.totalAmount ?? o?.totalCost ?? o?.subtotal ?? 0),
    distance: '2.5 km',
    items,
    deliveryAddress,
    estimatedTime: String(o?.estimatedDeliveryTime ?? '30 mins'),
    latitude,
    longitude,
    status: o?.status,
  };
};

export default function AcceptedOrderList({
  orders,
  onUpdateStatus,
  loadingOrderId,
}: Props) {
  const styles = useStyles();

  const uiOrders = useMemo(
    () => (orders ?? []).map(toAcceptedUiOrder),
    [orders],
  );

  return (
    <FlatList
      data={uiOrders}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        // <AcceptedOrderCard
        //   order={item}
        //   onUpdateStatus={onUpdateStatus}
        //   loading={String(item.id) === String(loadingOrderId)}
        // />
        <AcceptedOrderCard
          order={item}
          onUpdateStatus={onUpdateStatus}
          loading={loadingOrderId === item.id}
        />
      )}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    />
  );
}
