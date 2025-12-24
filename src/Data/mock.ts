export interface Order {
  id: string;
  restaurantName: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: string[];
  totalAmount: number;
  distance: string;
  estimatedTime: string;
  pickupAddress: string; 
  status: 'pending' | 'accepted' | 'picked_up' | 'on_the_way' | 'delivered';
  placedAt?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'system' | 'earning';
  data?: Record<string, any>;
}

export const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    restaurantName: 'Pizza Palace',
    customerName: 'John Smith',
    customerPhone: '+1 (555) 123-4567',
    deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
    items: ['Large Pepperoni Pizza', 'Garlic Bread', 'Coke (500ml)'],
    totalAmount: 28.5,
    distance: '2.3 km',
    estimatedTime: '15 min',
    pickupAddress: '456 Restaurant Ave, New York, NY',
    status: 'pending',
    placedAt: '2025-11-20T09:12:00Z',
  },
  {
    id: 'ORD-1002',
    restaurantName: 'Burger House',
    customerName: 'Sarah Johnson',
    customerPhone: '+1 (555) 987-6543',
    deliveryAddress: '789 Oak Street, Suite 12, New York, NY 10002',
    items: ['Double Cheeseburger', 'Large Fries', 'Chocolate Milkshake'],
    totalAmount: 19.99,
    distance: '1.8 km',
    estimatedTime: '12 min',
    pickupAddress: '321 Burger Lane, New York, NY',
    status: 'accepted',
    placedAt: '2025-11-20T09:20:00Z',
  },
  {
    id: 'ORD-1003',
    restaurantName: 'Sushi Express',
    customerName: 'Mike Davis',
    customerPhone: '+1 (555) 246-8135',
    deliveryAddress: '456 Park Avenue, Floor 3, New York, NY 10003',
    items: ['California Roll (8 pcs)', 'Salmon Sashimi', 'Miso Soup'],
    totalAmount: 34.75,
    distance: '3.5 km',
    estimatedTime: '20 min',
    pickupAddress: '654 Sushi Road, New York, NY',
    status: 'picked_up',
    placedAt: '2025-11-20T08:55:00Z',
    notes: 'Customer requested cutlery and extra soy sauce.',
  },
  {
    id: 'ORD-1004',
    restaurantName: 'Taco Fiesta',
    customerName: 'Priya Patel',
    customerPhone: '+1 (555) 444-2211',
    deliveryAddress: '22 Elm St, Brooklyn, NY 11201',
    items: ['3x Chicken Tacos', 'Churros (2)', 'Soda'],
    totalAmount: 22.0,
    distance: '4.2 km',
    estimatedTime: '25 min',
    pickupAddress: '88 Fiesta Road, Brooklyn, NY',
    status: 'on_the_way',
    placedAt: '2025-11-20T09:00:00Z',
  },
  {
    id: 'ORD-1005',
    restaurantName: 'Green Salad Co.',
    customerName: 'Aisha Khan',
    customerPhone: '+1 (555) 333-7700',
    deliveryAddress: '400 Broadway, New York, NY 10013',
    items: ['Kale Caesar Salad', 'Avocado Toast'],
    totalAmount: 16.25,
    distance: '1.2 km',
    estimatedTime: '10 min',
    pickupAddress: '400 Broadway, New York, NY',
    status: 'delivered',
    placedAt: '2025-11-19T18:30:00Z',
  },
  {
    id: 'ORD-1006',
    restaurantName: 'Curry House',
    customerName: 'Ravi Kumar',
    customerPhone: '+1 (555) 222-1199',
    deliveryAddress: '101 Sunset Blvd, Queens, NY 11101',
    items: ['Butter Chicken', 'Garlic Naan', 'Basmati Rice'],
    totalAmount: 24.5,
    distance: '5.0 km',
    estimatedTime: '30 min',
    pickupAddress: '101 Curry St, Queens, NY',
    status: 'pending',
    placedAt: '2025-11-20T09:25:00Z',
    notes: 'Allergic to peanuts — do not include sauces containing nuts.',
  },
  {
    id: 'ORD-1007',
    restaurantName: 'Veggie Delight',
    customerName: 'Olivia Brown',
    customerPhone: '+1 (555) 777-8899',
    deliveryAddress: '77 Park Lane, New York, NY 10021',
    items: ['Grilled Veggie Wrap', 'Sweet Potato Fries'],
    totalAmount: 14.75,
    distance: '2.0 km',
    estimatedTime: '14 min',
    pickupAddress: '77 Park Lane, New York, NY',
    status: 'pending',
    placedAt: '2025-11-20T09:30:00Z',
  },
  {
    id: 'ORD-1008',
    restaurantName: 'Steak & Co.',
    customerName: 'Carlos Mendes',
    customerPhone: '+1 (555) 888-9900',
    deliveryAddress: '9 River Rd, Hoboken, NJ 07030',
    items: ['Ribeye Steak (Medium)', 'Mashed Potatoes', 'House Salad'],
    totalAmount: 45.0,
    distance: '6.7 km',
    estimatedTime: '35 min',
    pickupAddress: '12 Steak Ave, Hoboken, NJ',
    status: 'accepted',
    placedAt: '2025-11-20T08:50:00Z',
  },
];

export const initialNotifications: Notification[] = [
  {
    id: 'N-9001',
    title: 'Welcome Back!',
    message: 'You have 3 new orders available in your area.',
    time: '2 min ago',
    read: false,
    type: 'system',
  },
  {
    id: 'N-9002',
    title: 'Earning Milestone',
    message: 'Congrats! You earned $145.80 today.',
    time: '1 hour ago',
    read: false,
    type: 'earning',
    data: { amount: 145.8, period: 'today' },
  },
  {
    id: 'N-9003',
    title: 'Order Assigned',
    message: 'New order from Pizza Palace — $28.50 — 2.3 km away.',
    time: 'Just now',
    read: false,
    type: 'order',
    data: { orderId: 'ORD-1001' },
  },
  {
    id: 'N-9004',
    title: 'System Update',
    message: 'Maintenance scheduled at 12:00 AM. App may restart.',
    time: '3 hours ago',
    read: true,
    type: 'system',
  },
  {
    id: 'N-9005',
    title: 'Delivery Completed',
    message: 'You completed delivery ORD-1005. $16.25 added to your balance.',
    time: 'Yesterday',
    read: true,
    type: 'earning',
    data: { orderId: 'ORD-1005', amount: 16.25 },
  },
  {
    id: 'N-9006',
    title: 'Reminder',
    message: 'Please remember to verify order items before pickup.',
    time: '2 days ago',
    read: true,
    type: 'system',
  },
];

