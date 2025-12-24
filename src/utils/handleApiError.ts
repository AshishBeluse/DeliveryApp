import { AxiosError } from 'axios';

export interface ErrorResponseData {
  message?: string;
  [key: string]: any;
}

export interface StandardizedError {
  message: string;
  status: number;
  details: ErrorResponseData;
}

const handleApiError = (error: unknown): StandardizedError => {
  const axiosError = error as AxiosError<ErrorResponseData>;

  const message = 
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.msg ||
    axiosError?.message ||
    'Unknown error';

  const status = axiosError?.response?.status || 500;

  const details = axiosError?.response?.data || {};

  console.error('🔴 API Error:', {
    message,
    status,
    data: details,
    headers: axiosError?.response?.headers || {},
    config: axiosError?.config || {},
    stack: axiosError?.stack || 'No stack',
  });

  return {
    message,
    status,
    details,
  };
};

export default handleApiError;

