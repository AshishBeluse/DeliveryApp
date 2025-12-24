import { api } from './http';
import type { UploadFile } from './types';

// export type UploadFile = { uri: string; name: string; type: string };

export type Driver = {
  id: number;
  name: string;
  phone: string;
  isApproved?: boolean;
  isActive?: boolean;
  isOnline?: boolean;
};

export type LoginResponse = {
  message: string;
  token: string;
  driver: Driver;
};

export type RegisterResponse = {
  message: string;
  phone: string;
  otp?: string;
};

export type VerifyOtpResponse = {
  message: string;
  token: string;
  driver: Driver;
};

export type PendingOrdersResponse = { orders: any[] };

export type DashboardResponse = {
  success: boolean;
  data: {
    todaysEarning: number;
    todaysCompleted: number;
    weeklyEarning: number;
    weeklyCompleted: number;
    averageRating: string | number;
    totalEarning: number;
  };
  message: string;
};

export const DriverApi = {
  // Auth (password login)
  login: async (phone: string, password: string): Promise<LoginResponse> => {
    const res = await api.post('/pos/driver/auth/login', { phone, password });
    return res.data;
  },

  // Auth (register => otp => verify)
  register: async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
    licenseImage?: UploadFile;
    idProofImage?: UploadFile;
  }): Promise<RegisterResponse> => {
    const form = new FormData();
    form.append('name', payload.name);
    form.append('email', payload.email);
    form.append('phone', payload.phone);
    form.append('password', payload.password);
    form.append('vehicleType', payload.vehicleType);
    form.append('vehicleNumber', payload.vehicleNumber);
    form.append('licenseNumber', payload.licenseNumber);

    if (payload.licenseImage)
      form.append('licenseImage', payload.licenseImage as any);
    if (payload.idProofImage)
      form.append('idProofImage', payload.idProofImage as any);

    const res = await api.post('/pos/driver/auth/register', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  verifyOtp: async (phone: string, otp: string): Promise<VerifyOtpResponse> => {
    const res = await api.post('/pos/driver/auth/verify-otp', { phone, otp });
    return res.data;
  },

  // Driver
  setOnline: async (isOnline: boolean) => {
    const res = await api.post('/pos/driver/online', { isOnline });
    return res.data as { message: string; isOnline: boolean };
  },

  updateLocation: async (lat: number, lng: number) => {
    const res = await api.post('/pos/driver/update-location', { lat, lng });
    return res.data as { message: string };
  },

  dashboard: async (driverId: number): Promise<DashboardResponse> => {
    const res = await api.get(`/pos/driver/dashboard/${driverId}`);
    return res.data;
  },

  // Orders
  pendingOrders: async (): Promise<PendingOrdersResponse> => {
    const res = await api.get('/pos/driver/orders/pending');
    return res.data;
  },

  acceptOrder: async (orderId: number) => {
    const res = await api.post('/pos/driver/accept-order', { orderId });
    return res.data;
  },

  updateStatus: async (orderId: number, status: string) => {
    const res = await api.post('/pos/driver/update-status', {
      orderId,
      status,
    });
    return res.data;
  },
};
