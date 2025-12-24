import React, { useMemo } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import OrderCard, { UiOrder } from './OrderCard';
import useListStyles from './OrderListStyles';
import { formatDeliveryAddress, extractLatLng } from '../../utils/address';

interface ApiOrder {
  id: number;
  customerId: number;
  restaurant: { name: string } | null;
  items: { name: string }[];
  deliveryAddress: any;
  estimatedDeliveryTime: string | null;
  totalAmount?: string;
  totalCost?: string;
  subtotal?: string;
}

interface Props {
  orders: ApiOrder[];
  onAcceptOrder: (orderId: string) => void;
  hasActiveOrder: boolean;
}

const toUiOrder = (o: ApiOrder): UiOrder => {
  const { latitude, longitude } = extractLatLng(o.deliveryAddress);

  return {
    id: String(o.id),
    restaurantName: o.restaurant?.name ?? 'Unknown Restaurant',
    customerName: `Customer #${o.customerId ?? '-'}`,
    totalAmount: Number(o.totalAmount ?? o.totalCost ?? o.subtotal ?? 0),
    distance: '2.5 km',
    items: (o.items ?? []).map(i => i?.name ?? ''),
    deliveryAddress: formatDeliveryAddress(o.deliveryAddress),
    estimatedTime: o.estimatedDeliveryTime ?? '30 mins',
    latitude,
    longitude,
  };
};

export default function ActiveOrderList({
  orders,
  onAcceptOrder,
  hasActiveOrder,
}: Props) {
  const styles = useListStyles();

  const uiOrders = useMemo(() => (orders ?? []).map(toUiOrder), [orders]);

  return (
    <FlatList
      data={uiOrders}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <OrderCard
          order={item}
          onAccept={() => onAcceptOrder(item.id)}
          disabled={hasActiveOrder}
        />
      )}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  );
}
