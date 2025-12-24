import React, { useMemo } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  acceptOrderThunk,
  fetchPendingOrdersThunk,
} from '../../redux/ordersSlice/ordersSlice';
import { dashboardThunk } from '../../redux/driverSlice/driverSlice';
import Button from '../../components/button/button';

export default function OrderDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const orderId = String(route.params?.orderId ?? '');
  const pendingOrders = useAppSelector(s => s.orders.pending);

  const order = useMemo(
    () => pendingOrders.find((o: any) => String(o?.id) === orderId),
    [pendingOrders, orderId],
  );

  if (!order) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Order not found.</Text>
      </View>
    );
  }

  const onAccept = async () => {
    try {
      await dispatch(acceptOrderThunk({ orderId: Number(orderId) })).unwrap();
      await dispatch(fetchPendingOrdersThunk()).unwrap();
      await dispatch(dashboardThunk()).unwrap();

      Alert.alert('Accepted', 'Order accepted. Go to Home to start delivery.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Accept', String(e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Order #{orderId}</Text>
      <Text style={{ marginTop: 10 }}>
        Restaurant: {order?.restaurant?.name ?? '-'}
      </Text>
      <Text>Total: ₹{Number(order?.totalAmount ?? 0).toFixed(2)}</Text>

      <Button onPress={onAccept} style={{ marginTop: 16 }}>
        <Text>Accept Order</Text>
      </Button>
    </View>
  );
}
