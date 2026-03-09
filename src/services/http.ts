import axios, { AxiosError } from 'axios';
import { Env } from '../config/env';

let inMemoryToken: string | null = null;

/**
 * Set/clear token used by the API client.
 * Call this from auth thunks after login/logout and from bootstrapping.
 */
export function setApiToken(token: string | null) {
  inMemoryToken = token;
}

export const api = axios.create({
  baseURL: `${Env.API_BASE_URL}/api/v2`,
  timeout: Env.API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(cfg => {
  if (inMemoryToken) {
    cfg.headers = cfg.headers ?? {};

    cfg.headers.Authorization = `Bearer ${inMemoryToken}`;
  }

  // If the data is FormData, remove Content-Type header to let axios set it automatically
  // with the correct boundary for multipart/form-data
  if (cfg.data instanceof FormData) {
    delete cfg.headers['Content-Type'];
  }

  return cfg;
});

api.interceptors.response.use(
  res => res,
  error => {
    if (__DEV__) {
      console.log('🔴 API ERROR URL:', error?.config?.url);
      console.log('🔴 API ERROR METHOD:', error?.config?.method);
      console.log('🔴 API ERROR STATUS:', error?.response?.status);
      console.log('🔴 API ERROR STATUS TEXT:', error?.response?.statusText);
      console.log('🔴 API ERROR DATA:', error?.response?.data);
      console.log('🔴 API ERROR HEADERS:', error?.response?.headers);
      console.log('🔴 API ERROR MESSAGE:', error?.message);
      console.log('🔴 API ERROR REQUEST:', {
        url: error?.config?.url,
        method: error?.config?.method,
        headers: error?.config?.headers,
        data: error?.config?.data,
      });
      
      // Log full error for debugging
      if (error?.response) {
        console.log('🔴 FULL ERROR RESPONSE:', JSON.stringify(error.response, null, 2));
      } else if (error?.request) {
        console.log('🔴 ERROR REQUEST (no response):', error.request);
      } else {
        console.log('🔴 ERROR SETUP:', error.message);
      }
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong',
) {
  if (!err) return fallback;
  if (typeof err === 'string') return err;

  const e = err as AxiosError<any>;
  const msg = e.response?.data?.message || e.response?.data?.error || e.message;

  return msg || fallback;
}
