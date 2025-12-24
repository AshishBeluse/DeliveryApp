// src/navigation/types.ts

import { Notification } from "../../Data/mock";
import { Order } from "../../redux/ordersSlice/ordersSlice";

export default interface BottomTabProps {
  unreadCount: number;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  orders: Order[];
  activeOrder: Order | null; 
  todayEarnings: number;
  completedToday: number;
  onAcceptOrder: (id: string) => void;
  onUpdateStatus: (s: Order['status']) => void;
}

