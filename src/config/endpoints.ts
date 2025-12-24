const DRIVER_PREFIX = '/pos/driver';

export const ENDPOINTS = {
  // Auth
  LOGIN: `${DRIVER_PREFIX}/auth/login`,
  REGISTER: `${DRIVER_PREFIX}/auth/register`,
  VERIFY_OTP: `${DRIVER_PREFIX}/auth/verify-otp`,

  // Orders
  PENDING_ORDERS: `${DRIVER_PREFIX}/orders/pending`,
  ACCEPT_ORDER: `${DRIVER_PREFIX}/accept-order`,
  UPDATE_STATUS: `${DRIVER_PREFIX}/update-status`,

  // Driver
  ONLINE: `${DRIVER_PREFIX}/online`,
  UPDATE_LOCATION: `${DRIVER_PREFIX}/update-location`,
  DASHBOARD: (driverId: number) => `${DRIVER_PREFIX}/dashboard/${driverId}`,

  // Optional / future
  ROUTE_ETA: `${DRIVER_PREFIX}/route/eta`,
} as const;
