import { api } from './http';
import type { UploadFile } from './types';

export type RegisterResponse = { message: string; phone: string; otp: string };
export type LoginResponse = { message: string; token: string; driver: any };
export type VerifyOtpResponse = { message: string; token: string; driver: any };

export const AuthApi = {
  login: async (payload: { phone: string; password: string }) => {
    const res = await api.post('/pos/driver/auth/login', payload);
    return res.data as LoginResponse;
  },

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
  }) => {
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
    return res.data as RegisterResponse;
  },

  verifyOtp: async (payload: { phone: string; otp: string }) => {
    const res = await api.post('/pos/driver/auth/verify-otp', payload);
    return res.data as VerifyOtpResponse;
  },
};
