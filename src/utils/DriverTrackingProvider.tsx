import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../redux/hooks';
import { connectSocket, disconnectSocket } from '../services/realtime';
import { useLocation } from './LocationContext';

export function DriverTrackingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector(s => s.auth.token);
  const driverId = useAppSelector(s => s.auth.driver?.id);
  const isOnline = useAppSelector(s => s.driver.isOnline);
  const activeOrderId = useAppSelector(s => s.orders.activeOrder?.id); // optional

  const { location, refreshLocation } = useLocation();

  const socketRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Connect socket once (or reuse your existing connection logic)
  useEffect(() => {
    if (!token) return;

    const socket = connectSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      if (driverId) socket.emit('driver_join', { driverId });
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      disconnectSocket();
      socketRef.current = null;
    };
  }, [token, driverId]);

  // Start/stop interval based on online + (optional) active order
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;

    // Choose one:
    const shouldTrack = isOnline; // track always when online
    // const shouldTrack = isOnline && !!activeOrderId; // track only during active delivery

    if (!shouldTrack) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    if (timerRef.current) return; // already running

    timerRef.current = setInterval(async () => {
      const coords = location ?? (await refreshLocation());
      if (!coords) return;

      socket.emit('driver_location_update', {
        orderId: activeOrderId ? String(activeOrderId) : null, // depends on backend
        lat: coords.latitude,
        lng: coords.longitude,
      });
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isOnline, activeOrderId, location, refreshLocation]);

  return <>{children}</>;
}
