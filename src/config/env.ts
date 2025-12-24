import { GOOGLE_MAPS_KEY as GMK, API_BASE_URL, API_TIMEOUT } from '@env';

export const Env = {
  GOOGLE_MAPS_KEY: GMK, // runtime use in JS
  API_BASE_URL: (API_BASE_URL || '').replace(/\/+$/, ''),
  API_TIMEOUT: Number(API_TIMEOUT || 15000),
}; 
