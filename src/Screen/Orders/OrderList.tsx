import React, { useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStyles from './OrderListStyles';
import OrderCard, { UiOrder } from './OrderCard';
import { formatDeliveryAddress, extractLatLng } from '../../utils/address';

type Props = {
  orders: any[];
  onAcceptOrder: (orderId: string) => void;
  hasActiveOrder: boolean;
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

const toUiOrder = (o: any): UiOrder => {
  const rawAddress =
    o?.deliveryAddress ??
    o?.address?.full ??
    o?.delivery?.address ??
    o?.customer?.address ??
    null;

  const { latitude, longitude } = extractLatLng(rawAddress);
  const deliveryAddress = formatDeliveryAddress(rawAddress);

  return {
    id: String(o?.id ?? ''),
    restaurantName: o?.restaurant?.name ?? 'Unknown Restaurant',
    customerName: `Customer #${o?.customerId ?? '-'}`,
    totalAmount: Number(o?.totalAmount ?? o?.totalCost ?? o?.subtotal ?? 0),
    distance: '2.5 km',
    items: (o?.items ?? []).map((i: any) => i?.name ?? String(i)),
    deliveryAddress,
    estimatedTime: String(o?.estimatedDeliveryTime ?? '30 mins'),

    latitude,
    longitude,
  };
};

export default function OrderList({
  orders,
  onAcceptOrder,
  hasActiveOrder,
}: Props) {
  const styles = useStyles();

  const navigation = useNavigation<any>();
  const uiOrders = useMemo(() => (orders ?? []).map(toUiOrder), [orders]);

  return (
    <FlatList
      data={uiOrders}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <OrderCard
          order={item}
          disabled={hasActiveOrder}
          onAccept={() => onAcceptOrder(item.id)}
          // onPress={() =>
          //   navigation.navigate('OrderDetails', { orderId: item.id })
          // }
        />
      )}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  );
}
